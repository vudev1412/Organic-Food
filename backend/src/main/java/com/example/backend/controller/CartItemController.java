package com.example.backend.controller;

import com.example.backend.domain.CartItem;
import com.example.backend.domain.response.ResCartItemDTO;
import com.example.backend.service.CartItemService;
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

    @PostMapping("/items")
    public ResponseEntity<CartItem> createCartItem(@RequestBody CartItem cartItem){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.cartItemService.handleCreateCartItem(cartItem));
    }
    @GetMapping("/items")
    public ResponseEntity<List<ResCartItemDTO>> getAllCartItem(){
        return ResponseEntity.ok().body(this.cartItemService.handleGetAllCartItem());
    }
    @GetMapping("/items/{id}")
    public ResponseEntity<ResCartItemDTO> getCartItemById(@PathVariable Long id){
        return ResponseEntity.ok().body(this.cartItemService.handleGetCartItemById(id));
    }
    @PatchMapping("/items/{id}")
    public ResponseEntity<ResCartItemDTO> updateCartItem(@PathVariable Long id, @RequestBody CartItem cartItem){
        return ResponseEntity.ok().body(this.cartItemService.handleUpdateCartItem(id, cartItem));
    }

}
