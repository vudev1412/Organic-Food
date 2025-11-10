package com.example.backend.service;

import com.example.backend.domain.CartItem;
import com.example.backend.domain.response.ResCartItemDTO;

import java.util.List;

public interface CartItemService {
    public CartItem handleCreateCartItem(CartItem cartItem);
    public ResCartItemDTO handleGetCartItemById(Long id);
    public List<ResCartItemDTO> handleGetAllCartItem();
    public ResCartItemDTO handleUpdateCartItem(Long id, CartItem cartItem);
    public void handleDeleteCartItem(Long id);
}
