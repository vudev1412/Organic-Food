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
    import org.springframework.web.bind.annotation.*;

    import java.util.List;


    @RestController
    @RequestMapping("/api/v1")
    public class ProductController {
        private final ProductService productService;
        public ProductController(ProductService productService){
            this.productService = productService;
        }


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
        @GetMapping("/products/{id}")
        public ResponseEntity<ResGetAllProductDTO> getProductById(@PathVariable Long id){
            return ResponseEntity.ok().body(this.productService.handleGetProductById(id));
        }



        @PatchMapping("/products/{id}")
        public ResponseEntity<ResGetAllProductDTO> updateProduct(@PathVariable Long id, @RequestBody ReqProductDTO product){
            return ResponseEntity.ok().body(this.productService.handleUpdateProduct(id, product));
        }

        @DeleteMapping("/products/{id}")
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
