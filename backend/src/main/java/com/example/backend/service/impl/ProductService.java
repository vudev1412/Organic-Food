package com.example.backend.service.impl;

import com.example.backend.domain.*;
import com.example.backend.domain.key.ProductCertificateKey;
import com.example.backend.domain.request.ReqProductCertificateDTO;
import com.example.backend.domain.request.ReqProductDTO;
import com.example.backend.domain.response.*;
import com.example.backend.enums.TypePromotion;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ResProductDTO;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.PromotionDetailService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final UnitRepository unitRepository;
    private final ProductImageRepository productImageRepository;
    private final CertificateRepository certificateRepository;
    private final ProductCertificateRepository productCertificateRepository;
    private final PromotionDetailService promotionDetailService;
    private final ReceiptDetailRepository receiptDetailRepository;
    private final PromotionDetailRepository promotionDetailRepository;
    private final PromotionRepository promotionRepository;


    public ResGetAllProductDTO handleGetProductById(Long id) {
        Product product = this.productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return this.productMapper.toResProductDto(product);
    }

    @Transactional
    public ResGetAllProductDTO createProduct(ReqProductDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Unit unit = unitRepository.findById(dto.getUnitId())
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        // --- tạo product ---
        Product product = productMapper.toEntity(dto);
        product.setCategory(category);
        product.setUnit(unit);
        product.setActive(dto.isActive());
        product.setMfgDate(dto.getMfgDate());
        product.setExpDate(dto.getExpDate());

        productRepository.save(product);

        // --- tạo product images ---
        if (dto.getProductImages() != null) {
            for (String url : dto.getProductImages()) {
                ProductImage img = new ProductImage();
                img.setImgUrl(url);
                img.setProduct(product);
                productImageRepository.save(img);
            }
        }

        // --- tạo product certificates ---
        if (dto.getCertificates() != null) {
            for (ReqProductCertificateDTO c : dto.getCertificates()) {

                Certificate cert = certificateRepository.findById(c.getCertificateId())
                        .orElseThrow(() -> new RuntimeException("Certificate not found"));

                ProductCertificate pc = new ProductCertificate();

                ProductCertificateKey key = new ProductCertificateKey();
                key.setProductId(product.getId());
                key.setCertificateId(cert.getId());

                pc.setId(key);
                pc.setProduct(product);
                pc.setCertificate(cert);
                pc.setImageUrl(c.getImageUrl());
                pc.setCertNo(c.getCertNo());
                pc.setDate(c.getDate());

                productCertificateRepository.save(pc);
            }
        }

        return productMapper.toResProductDto(product);

    }

    public ResultPaginationDTO getAllProducts(Specification<Product> spec, Pageable pageable) {

        Page<ResGetAllProductDTO> pageProduct = productRepository
                .findAll(spec, pageable)
                .map(productMapper::toResProductDto);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageProduct.getTotalPages());
        meta.setTotal(pageProduct.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pageProduct.getContent());

        return rs;
    }




    @Transactional
    public ResGetAllProductDTO handleUpdateProduct(Long id, ReqProductDTO dto) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // Cập nhật thông tin cơ bản
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setOrigin_address(dto.getOrigin_address());
        product.setDescription(dto.getDescription());
        product.setQuantity(dto.getQuantity());
        product.setActive(dto.isActive());
        product.setMfgDate(dto.getMfgDate());
        product.setExpDate(dto.getExpDate());
        product.setUpdateAt(Instant.now());

        // Cập nhật danh mục
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
            product.setCategory(category);
        }

        // Cập nhật đơn vị
        if (dto.getUnitId() != null) {
            Unit unit = unitRepository.findById(dto.getUnitId())
                    .orElseThrow(() -> new RuntimeException("Đơn vị không tồn tại"));
            product.setUnit(unit);
        }

        // Cập nhật ảnh chính
        if (dto.getImage() != null && !dto.getImage().isBlank()) {
            product.setImage(dto.getImage());
        }

        // === CẬP NHẬT ẢNH PHỤ (MERGE) ===
        List<ProductImage> oldImages = productImageRepository.findByProduct_Id(product.getId());
        List<String> newImageUrls = dto.getProductImages() != null ? dto.getProductImages() : List.of();

        // Xóa ảnh cũ không còn
        oldImages.stream()
                .filter(old -> !newImageUrls.contains(old.getImgUrl()))
                .forEach(productImageRepository::delete);

        // Thêm ảnh mới
        newImageUrls.stream()
                .filter(url -> oldImages.stream().noneMatch(old -> old.getImgUrl().equals(url)))
                .map(url -> {
                    ProductImage img = new ProductImage();
                    img.setImgUrl(url);
                    img.setProduct(product);
                    return img;
                })
                .forEach(productImageRepository::save);

        // === CẬP NHẬT CHỨNG CHỈ (MERGE + CẬP NHẬT NẾU THAY ĐỔI) ===
        List<ProductCertificate> oldCerts = productCertificateRepository.findByIdProductId(product.getId());
        List<ReqProductCertificateDTO> newCerts = dto.getCertificates() != null ? dto.getCertificates() : List.of();

        // Map cũ theo certificateId để dễ so sánh
        Map<Long, ProductCertificate> oldCertMap = oldCerts.stream()
                .collect(Collectors.toMap(pc -> pc.getCertificate().getId(), pc -> pc));

        for (ReqProductCertificateDTO nc : newCerts) {
            Long certId = nc.getCertificateId();
            Certificate cert = certificateRepository.findById(certId)
                    .orElseThrow(() -> new RuntimeException("Chứng chỉ không tồn tại: " + certId));

            ProductCertificate pc = oldCertMap.get(certId);

            if (pc == null) {
                // Thêm mới
                pc = new ProductCertificate();
                ProductCertificateKey key = new ProductCertificateKey(product.getId(), certId);
                pc.setId(key);
                pc.setProduct(product);
                pc.setCertificate(cert);
            }

            // Cập nhật thông tin (dù cũ hay mới đều cập nhật lại)
            pc.setCertNo(nc.getCertNo());
            pc.setImageUrl(nc.getImageUrl());
            pc.setDate(nc.getDate());

            productCertificateRepository.save(pc);
            oldCertMap.remove(certId); // Đánh dấu đã xử lý
        }

        // Xóa những chứng chỉ cũ không còn trong danh sách mới
        oldCertMap.values().forEach(productCertificateRepository::delete);

        // Lưu sản phẩm
        Product saved = productRepository.save(product);
        return productMapper.toBaseResProductDTO(saved);
    }

    public String handleDeleteProduct(Long id){
        this.productRepository.deleteById(id);
        return "Delete success";
    }



    public ResultPaginationDTO handleGetProductByCategoryId(Long categoryId, Specification<Product> spec, Pageable pageable) {


        final List<Long> categoryIdsToSearch;

        List<Category> childrenCategories = this.categoryRepository.findAllByParentCategoryId(categoryId);

        if (childrenCategories.isEmpty()) {
            // Gán lần đầu tiên (và duy nhất)
            // Dùng List.of() để tạo nhanh một list chỉ chứa 1 phần tử (ID cha)
            categoryIdsToSearch = List.of(categoryId);
        } else {
            // Gán lần đầu tiên (và duy nhất)
            categoryIdsToSearch = childrenCategories.stream()
                    .map(Category::getId)
                    .collect(Collectors.toList());


        }


        // 2. Tạo Specification cho category (Giữ nguyên)
        Specification<Product> categorySpec = (root, query, cb) -> {
            return root.get("category").get("id").in(categoryIdsToSearch);
        };


        // 3. Kết hợp 2 Specification
        // Bắt đầu với categorySpec (luôn luôn tồn tại)
        Specification<Product> finalSpec = categorySpec;

        // Chỉ kết hợp 'spec' (từ filter) nếu nó không null
        if (spec != null) {
            finalSpec = finalSpec.and(spec);
        }

        // 4. Gọi hàm findAll() với spec cuối cùng
        Page<ResProductDTO> pageProduct = this.productRepository
                .findAll(finalSpec, pageable) // Dùng 'finalSpec' đã kết hợp
                .map(productMapper::toBaseResProductDto);

        // 5. Logic tạo Meta/ResultPaginationDTO (Giữ nguyên)
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(pageProduct.getTotalPages());
        meta.setTotal(pageProduct.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pageProduct.getContent());

        return rs;
    }
    public List<ResProductSearchDTO> handleSearchProductWithPromotion(String query, int size) {
        Pageable pageable = PageRequest.of(0, size);

        // 1. Lấy danh sách startsWith
        List<Product> startsWith = productRepository
                .findByNameStartingWithIgnoreCase(query, pageable);

        // 2. Lấy danh sách contains
        List<Product> contains = productRepository
                .findByNameContainingIgnoreCase(query, pageable);

        // 3. Loại bỏ những sản phẩm đã nằm trong startsWith
        contains.removeIf(p ->
                startsWith.stream()
                        .anyMatch(s -> s.getId() == p.getId())
        );


        // 4. Ghép 2 danh sách (StartsWith ưu tiên → đứng trước)
        List<Product> finalProducts = new ArrayList<>();
        finalProducts.addAll(startsWith);
        finalProducts.addAll(contains);

        // 5. Map sang DTO + Khuyến mãi
        return finalProducts.stream().map(product -> {
            ResProductDTO productDTO = this.convertToResProductDTO(product);

            BestPromotionDTO bestPromotion = promotionDetailService
                    .findBestActivePromotion(product.getId())
                    .orElse(null);

            return new ResProductSearchDTO(productDTO, bestPromotion);
        }).collect(Collectors.toList());
    }

    public ResProductDTO convertToResProductDTO(Product product) {
        ResProductDTO.ResProductDTOBuilder dtoBuilder = ResProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .origin_address(product.getOrigin_address())
                .description(product.getDescription())
                .rating_avg(product.getRating_avg())
                .quantity(product.getQuantity())
                .slug(product.getSlug())
                .image(product.getImage())
                .active(product.isActive())
                .mfgDate(product.getMfgDate())
                .expDate(product.getExpDate())
                .createAt(product.getCreateAt())
                .updateAt(product.getUpdateAt())
                .createBy(product.getCreateBy())
                .updateBy(product.getUpdateBy());

        // Xử lý Category: Lấy ID nếu category không null
        if (product.getCategory() != null) {
            dtoBuilder.categoryId(product.getCategory().getId());
        }

        // Xử lý Unit: Lấy tên Unit (String) nếu unit không null
        if (product.getUnit() != null) {
            dtoBuilder.unit(product.getUnit().getName());
        }

        return dtoBuilder.build();
    }
    public List<ResProductDTO> handleGetNewestImportedProducts(int size) {
        List<Product> products = receiptDetailRepository
                .findNewestImportedProducts(PageRequest.of(0, size));

        // loại trùng sản phẩm nếu 1 sản phẩm nhập nhiều lần
        return products.stream()
                .distinct()
                .map(ResProductDTO::new)
                .toList();
    }
    public ResultPaginationDTO handleGetBestPromotionProducts(int page, int size) {

        Page<Object[]> result = productRepository.findProductsWithBestPromotion(
                PageRequest.of(page - 1, size)
        );

        List<ResNewArrivalWithPromotionDTO> list = result.getContent().stream().map(row -> {
            Product p = (Product) row[0];
            Promotion promo = (Promotion) row[1];
            Double discount = row[2] != null ? (Double) row[2] : 0;
            Instant start = (Instant) row[3];
            Instant end = (Instant) row[4];

            ResNewArrivalWithPromotionDTO dto = new ResNewArrivalWithPromotionDTO();

            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setUnit(p.getUnit() != null ? p.getUnit().getName() : null);
            dto.setOriginalPrice(p.getPrice());
            dto.setFinalPrice(p.getPrice() - discount);
            dto.setOrigin_address(p.getOrigin_address());
            dto.setDescription(p.getDescription());
            dto.setRating_avg(p.getRating_avg());
            dto.setQuantity(p.getQuantity());
            dto.setSlug(p.getSlug());
            dto.setImage(p.getImage());
            dto.setActive(p.isActive());
            dto.setCategoryId(p.getCategory() != null ? p.getCategory().getId() : null);

            dto.setPromotionId(promo.getId());
            dto.setPromotionName(promo.getName());
            dto.setPromotionType(promo.getType().name());
            dto.setPromotionValue(promo.getValue());
            dto.setPromotionStartDate(start);
            dto.setPromotionEndDate(end);

            return dto;
        }).toList();

        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(page);
        meta.setPageSize(size);
        meta.setPages(result.getTotalPages());
        meta.setTotal(result.getTotalElements());

        ResultPaginationDTO response = new ResultPaginationDTO();
        response.setMeta(meta);
        response.setResult(list);

        return response;
    }

    public ResultPaginationDTO handleGetNewestImportedProductsWithPromotion(int page, int size) {

        Page<Object[]> result = receiptDetailRepository.findNewestProductsWithPromotion(
                PageRequest.of(page - 1, size)
        );

        List<ResNewArrivalWithPromotionDTO> list = result.getContent().stream().map(row -> {
            Product p = (Product) row[0];
            Promotion promo = (Promotion) row[1];
            Double discount = row[2] != null ? (Double) row[2] : 0;
            Instant start = (Instant) row[3];
            Instant end = (Instant) row[4];

            ResNewArrivalWithPromotionDTO dto = new ResNewArrivalWithPromotionDTO();

            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setUnit(p.getUnit() != null ? p.getUnit().getName() : null);
            dto.setOriginalPrice(p.getPrice());
            dto.setFinalPrice(p.getPrice() - discount);
            dto.setOrigin_address(p.getOrigin_address());
            dto.setDescription(p.getDescription());
            dto.setRating_avg(p.getRating_avg());
            dto.setQuantity(p.getQuantity());
            dto.setSlug(p.getSlug());
            dto.setImage(p.getImage());
            dto.setActive(p.isActive());
            dto.setCategoryId(p.getCategory() != null ? p.getCategory().getId() : null);

            if (promo != null) {
                dto.setPromotionId(promo.getId());
                dto.setPromotionName(promo.getName());
                dto.setPromotionType(promo.getType().name());
                dto.setPromotionValue(promo.getValue());
                dto.setPromotionStartDate(start);
                dto.setPromotionEndDate(end);
            }

            return dto;
        }).toList();

        // Build Meta
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(page);
        meta.setPageSize(size);
        meta.setPages(result.getTotalPages());
        meta.setTotal(result.getTotalElements());

        // Final Response
        ResultPaginationDTO response = new ResultPaginationDTO();
        response.setMeta(meta);
        response.setResult(list);

        return response;
    }

    public ResultPaginationDTO handleGetProductsByPromotionId(long promotionId, Pageable pageable) {
        // 1. Lấy thông tin Promotion gốc
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + promotionId));

        // 2. Truy vấn danh sách từ bảng PromotionDetail
        Page<PromotionDetail> pageDetails = promotionDetailRepository.findByPromotionId(promotionId, pageable);

        // 3. Map dữ liệu sang DTO (List kết quả)
        List<ResProductByPromotionDTO> listDTO = pageDetails.getContent().stream().map(detail -> {
            Product product = detail.getProduct();

            ResProductByPromotionDTO dto = new ResProductByPromotionDTO();
            dto.setProductId(product.getId());
            dto.setProductName(product.getName());
            dto.setImage(product.getImage());
            dto.setOriginalPrice(product.getPrice());
            dto.setSlug(product.getSlug());
            dto.setQuantity(product.getQuantity());
            // Lấy ngày bắt đầu/kết thúc cụ thể từ bảng chi tiết
            dto.setPromotionStartDate(detail.getStartDate());
            dto.setPromotionEndDate(detail.getEndDate());
            dto.setPromotionType(promotion.getType());
            dto.setPromotionValue(promotion.getValue());


            // --- Logic tính giá sau giảm ---
            double discountAmount = 0;
            if (TypePromotion.PERCENT.equals(promotion.getType())) {
                discountAmount = product.getPrice() * (promotion.getValue() / 100);
            } else {
                discountAmount = promotion.getValue();
            }

            double finalPrice = product.getPrice() - discountAmount;
            dto.setDiscountedPrice(finalPrice < 0 ? 0 : finalPrice);

            return dto;
        }).collect(Collectors.toList());

        // 4. Tạo đối tượng Meta (Inner Class) theo đúng cấu trúc của bạn
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(pageable.getPageNumber() + 1); // Pageable bắt đầu từ 0, client thường bắt đầu từ 1
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageDetails.getTotalPages());
        meta.setTotal(pageDetails.getTotalElements());

        // 5. Đóng gói kết quả vào ResultPaginationDTO
        ResultPaginationDTO response = new ResultPaginationDTO();
        response.setMeta(meta);
        response.setResult(listDTO);

        return response;
    }
}





