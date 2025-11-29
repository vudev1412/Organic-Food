package com.example.backend.controller;

import com.example.backend.domain.Cart;
import com.example.backend.domain.User;
import com.example.backend.domain.response.CartItemDTO;
import com.example.backend.domain.response.ResCartDTO;
import com.example.backend.service.CartService;
import com.example.backend.service.UserService;
import com.example.backend.util.SecurityUtil;
import com.example.backend.util.annotation.ApiMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CartController {
    private final CartService cartService;
    private final UserService userService;

    @PostMapping("/cart")
    public ResponseEntity<Cart> createCart(@RequestBody Cart cart){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.cartService.handleCreateCart(cart));
    }
    @GetMapping("/cart")
    public ResponseEntity<List<ResCartDTO>> getAllCart(){
        return ResponseEntity.ok().body(this.cartService.handleGetAllCart());
    }
    @GetMapping("/cart/{id}")
    public ResponseEntity<ResCartDTO> getCartById(@PathVariable Long id){
        return ResponseEntity.ok().body(this.cartService.handleGetCartById(id));
    }
    @GetMapping("/cart/my-cart")
    @ApiMessage("Fetch my cart")
    public ResponseEntity<List<CartItemDTO>> getMyCart(){
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated"));
        User currentUser = this.userService.handleGetUserByUsername(email);
        if(currentUser == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        List<CartItemDTO> cartItems = this.cartService.getCartItemsByUserId(currentUser.getId());
        return ResponseEntity.ok(cartItems);
    }
    @PutMapping("/cart/{id}")
    public ResponseEntity<ResCartDTO> updateCart(@PathVariable Long id, @RequestBody Cart cart){
        return ResponseEntity.ok().body(this.cartService.handleUpdateCart(id,cart));
    }
    @DeleteMapping("/cart/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id){
        this.cartService.handleDeleteCart(id);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("cart/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {

        cartService.clearCartByUserId(userId);
        return ResponseEntity.ok("Clear cart successfully");
    }


}
