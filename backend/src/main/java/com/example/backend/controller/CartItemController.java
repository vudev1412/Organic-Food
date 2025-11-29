package com.example.backend.controller;

import com.example.backend.domain.CartItem;
import com.example.backend.domain.request.ReqCartItemDTO;
import com.example.backend.domain.response.ResCartItemDTO;
import com.example.backend.service.CartItemService;
import com.example.backend.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CartItemController {
    private final CartItemService cartItemService;

    // API Add to Cart chuẩn
    @PostMapping("/items")
    public ResponseEntity<ResCartItemDTO> addCartItem(@RequestBody ReqCartItemDTO req) throws IdInvalidException {
        // Gọi service xử lý logic thêm hoặc cộng dồn
        ResCartItemDTO result = this.cartItemService.handleAddCartItem(req);
        // Trả về 201 Created (hoặc 200 OK tùy bạn)
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
    @GetMapping("/items")
    public ResponseEntity<List<ResCartItemDTO>> getAllCartItem(){
        return ResponseEntity.ok().body(this.cartItemService.handleGetAllCartItem());
    }
    @GetMapping("/items/{id}")
    public ResponseEntity<ResCartItemDTO> getCartItemById(@PathVariable Long id){
        return ResponseEntity.ok().body(this.cartItemService.handleGetCartItemById(id));
    }
    @PutMapping("/items")
    public ResponseEntity<ResCartItemDTO> updateCartItem(@RequestBody ReqCartItemDTO req) throws IdInvalidException {
        // Frontend gửi: { "productId": 1, "quantity": 5 }
        ResCartItemDTO res = this.cartItemService.handleUpdateCartItem(req);

        if (res == null) {
            // Đã xóa sản phẩm
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204
        }

        return ResponseEntity.ok().body(res);
    }
    @DeleteMapping("/carts/{cartId}/items")
    public ResponseEntity<Void> deleteAllCartItemsByCartId(@PathVariable Long cartId) throws IdInvalidException {
        this.cartItemService.handleDeleteAllCartItemsByCartId(cartId);
        return ResponseEntity.noContent().build(); // 204
    }
    @DeleteMapping("/users/{userId}/cart/items")
    public ResponseEntity<Void> deleteAllCartItemsByUserId(@PathVariable Long userId) throws IdInvalidException {
        this.cartItemService.handleDeleteAllCartItemsByUserId(userId);
        return ResponseEntity.noContent().build(); // 204
    }



}
