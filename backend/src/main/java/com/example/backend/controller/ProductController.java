    package com.example.backend.controller;

    import com.example.backend.domain.Product;
    import com.example.backend.domain.request.ReqProductDTO;
    import com.example.backend.domain.response.*;
    import com.example.backend.service.impl.ProductService;
    import com.example.backend.util.annotation.ApiMessage;
    import com.turkraft.springfilter.boot.Filter;
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
        @GetMapping("/products/active")
        @ApiMessage("fetch all active products with pagination")
        public ResponseEntity<ResultPaginationDTO> getAllActiveProducts(
                @Filter Specification<Product> spec,
                Pageable pageable
        ) {
            // 1. Tạo điều kiện lọc: active = true
            Specification<Product> isActiveSpec = (root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("active"), true);

            // 2. Kết hợp với các bộ lọc khác từ client (nếu có)
            Specification<Product> finalSpec = spec != null ? spec.and(isActiveSpec) : isActiveSpec;

            // 3. Gọi service (tái sử dụng hàm getAllProducts có sẵn vì nó nhận Specification)
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
        @GetMapping("/product/category/{id}/active")
        @ApiMessage("fetch all active products by category id with pagination")
        public ResponseEntity<ResultPaginationDTO> getActiveProductByCategoryId(
                @PathVariable Long id,
                @Filter Specification<Product> spec,
                Pageable pageable
        ) {
            // 1. Tạo điều kiện lọc: Trường 'active' trong Product Entity phải là true
            Specification<Product> isActiveSpec = (root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("active"), true);

            // 2. Kết hợp với các bộ lọc khác (nếu có) từ client gửi lên (biến spec)
            // Nếu spec ban đầu null thì chỉ dùng isActiveSpec, ngược lại thì dùng AND
            Specification<Product> finalSpec = spec != null ? spec.and(isActiveSpec) : isActiveSpec;

            // 3. Gọi service (Service sẽ xử lý việc lọc theo categoryId = id và finalSpec)
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
