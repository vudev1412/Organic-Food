    package com.example.backend.controller;

    import com.example.backend.domain.Product;
    import com.example.backend.domain.ProductCertificate;
    import com.example.backend.domain.request.ReqProductDTO;
    import com.example.backend.domain.response.*;
    import com.example.backend.service.impl.ProductService;
    import com.example.backend.util.annotation.ApiMessage;
    import com.turkraft.springfilter.boot.Filter;
    import jakarta.persistence.criteria.Predicate;
    import jakarta.persistence.criteria.Root;
    import jakarta.persistence.criteria.Subquery;
    import jakarta.validation.Valid;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.jpa.domain.Specification;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;


    @RestController
    @RequestMapping("/api/v1")
    public class ProductController {
        private final ProductService productService;
        public ProductController(ProductService productService){
            this.productService = productService;
        }

        @PreAuthorize("hasRole('ADMIN') or hasRole('QLKho') or hasAuthority('QL SanPham')")
        @PostMapping("/products")
        public ResponseEntity<ResGetAllProductDTO> createProduct(@Valid @RequestBody ReqProductDTO dto) {
            return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(dto));
        }

        @GetMapping("/products")
        @ApiMessage("fetch all product")
        public ResponseEntity<ResultPaginationDTO> getAllProducts(
                @Filter Specification<Product> spec,
                Pageable pageable
        ) {

            return ResponseEntity.ok(productService.getAllProducts(spec, pageable));
        }
        @GetMapping("/products/active") // Hoặc endpoint category tương ứng
        public ResponseEntity<ResultPaginationDTO> getAllActiveProducts(
                @Filter Specification<Product> spec,
                Pageable pageable,
                @RequestParam(required = false) List<Long> certificateIds
        ) {
            Specification<Product> conditions = (root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("active"), true);

            // [LOGIC MỚI] Lọc theo điều kiện AND (Phải có tất cả chứng chỉ)
            if (certificateIds != null && !certificateIds.isEmpty()) {
                Specification<Product> certificateSpec = (root, query, criteriaBuilder) -> {
                    // Khởi tạo điều kiện AND ban đầu
                    Predicate finalPredicate = criteriaBuilder.conjunction();

                    // Duyệt qua từng ID chứng chỉ được chọn
                    for (Long certId : certificateIds) {
                        // Tạo subquery kiểm tra sự tồn tại của từng chứng chỉ
                        Subquery<Long> subquery = query.subquery(Long.class);
                        Root<ProductCertificate> subRoot = subquery.from(ProductCertificate.class);

                        subquery.select(subRoot.get("id")); // Select bất kỳ trường nào để check exists
                        subquery.where(
                                criteriaBuilder.equal(subRoot.get("product"), root), // Link bảng phụ về Product cha
                                criteriaBuilder.equal(subRoot.get("certificate").get("id"), certId) // Check ID chứng chỉ
                        );

                        // Nối điều kiện: AND EXISTS (...)
                        finalPredicate = criteriaBuilder.and(finalPredicate, criteriaBuilder.exists(subquery));
                    }

                    return finalPredicate;
                };
                conditions = conditions.and(certificateSpec);
            }

            Specification<Product> finalSpec = spec != null ? spec.and(conditions) : conditions;
            return ResponseEntity.ok(this.productService.getAllProducts(finalSpec, pageable));
        }
        @GetMapping("/products/{id}")
        public ResponseEntity<ResGetAllProductDTO> getProductById(@PathVariable Long id){
            return ResponseEntity.ok().body(this.productService.handleGetProductById(id));
        }



        @PatchMapping("/products/{id}")
        @PreAuthorize("hasRole('ADMIN') or hasRole('QLKho') or hasAuthority('QL SanPham')")
        public ResponseEntity<ResGetAllProductDTO> updateProduct(@PathVariable Long id, @RequestBody ReqProductDTO product){
            return ResponseEntity.ok().body(this.productService.handleUpdateProduct(id, product));
        }

        @DeleteMapping("/products/{id}")
        @PreAuthorize("hasRole('ADMIN') or hasRole('QLKho') or hasAuthority('QL SanPham')")
        public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
            this.productService.handleDeleteProduct(id);
            return ResponseEntity.noContent().build();
        }

        @GetMapping("/product/category/{id}")
        @ApiMessage("fetch all product by category id with pagination")
        public ResponseEntity<ResultPaginationDTO> getProductByCategoryId(
                @PathVariable Long id,
                @Filter Specification<Product> spec,
                Pageable pageable
        ) {
            return ResponseEntity.ok().body(this.productService.handleGetProductByCategoryId(id, spec, pageable));
        }
        // API lọc theo category tương tự
        @GetMapping("/product/category/{id}/active")
        @ApiMessage("fetch all active products by category id with pagination")
        public ResponseEntity<ResultPaginationDTO> getActiveProductByCategoryId(
                @PathVariable Long id,
                @Filter Specification<Product> spec,
                Pageable pageable,
                @RequestParam(required = false) List<Long> certificateIds
        ) {
            Specification<Product> conditions = (root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("active"), true);

            if (certificateIds != null && !certificateIds.isEmpty()) {
                Specification<Product> certificateSpec = (root, query, criteriaBuilder) -> {
                    Predicate finalPredicate = criteriaBuilder.conjunction();
                    for (Long certId : certificateIds) {
                        Subquery<Long> subquery = query.subquery(Long.class);
                        Root<ProductCertificate> subRoot = subquery.from(ProductCertificate.class);
                        subquery.select(subRoot.get("id"));
                        subquery.where(
                                criteriaBuilder.equal(subRoot.get("product"), root),
                                criteriaBuilder.equal(subRoot.get("certificate").get("id"), certId)
                        );
                        finalPredicate = criteriaBuilder.and(finalPredicate, criteriaBuilder.exists(subquery));
                    }
                    return finalPredicate;
                };
                conditions = conditions.and(certificateSpec);
            }

            Specification<Product> finalSpec = spec != null ? spec.and(conditions) : conditions;
            return ResponseEntity.ok().body(this.productService.handleGetProductByCategoryId(id, finalSpec, pageable));
        }
        @GetMapping("/products/search")
        @ApiMessage("Search products by name startWith and get best promotion")
        public ResponseEntity<List<ResProductSearchDTO>> searchProductPreview(
                @RequestParam("query") String query,
                @RequestParam(value = "size", defaultValue = "5") int size
        ) {
            // Gọi service xử lý
            return ResponseEntity.ok()
                    .body(this.productService.handleSearchProductWithPromotion(query, size));
        }
        @GetMapping("/products/new-arrivals")
        @ApiMessage("Fetch newest imported products with best promotion")
        public ResponseEntity<ResultPaginationDTO> getNewestImportedWithPromotion(
                @RequestParam(defaultValue = "1") int page,
                @RequestParam(defaultValue = "10") int size
        ) {
            return ResponseEntity.ok()
                    .body(productService.handleGetNewestImportedProductsWithPromotion(page, size));
        }


        @GetMapping("/products/best-promotion")
        @ApiMessage("Fetch products with the best active promotion")
        public ResponseEntity<ResultPaginationDTO> getBestPromotionProducts(
                @RequestParam(defaultValue = "1") int page,
                @RequestParam(defaultValue = "10") int size
        ) {
            return ResponseEntity.ok()
                    .body(productService.handleGetBestPromotionProducts(page, size));
        }
        @GetMapping("/products/promotion/{id}")
        @ApiMessage("Get products by promotion id with discounted price")
        public ResponseEntity<ResultPaginationDTO> getProductsByPromotionId(
                @PathVariable("id") long id,
                Pageable pageable
        ) {
            // Gọi xuống service để lấy danh sách sản phẩm theo promotion id
            return ResponseEntity.ok()
                    .body(this.productService.handleGetProductsByPromotionId(id, pageable));
        }



    }
