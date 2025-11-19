package com.example.backend.controller;

import com.example.backend.domain.Cart;
import com.example.backend.domain.response.ResCartDTO;
import com.example.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CartController {
    private final CartService cartService;

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
    @PutMapping("/cart/{id}")
    public ResponseEntity<ResCartDTO> updateCart(@PathVariable Long id, @RequestBody Cart cart){
        return ResponseEntity.ok().body(this.cartService.handleUpdateCart(id,cart));
    }
    @DeleteMapping("/cart/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id){
        this.cartService.handleDeleteCart(id);
        return ResponseEntity.noContent().build();
    }


}
