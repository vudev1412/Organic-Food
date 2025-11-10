package com.example.backend.service;

import com.example.backend.domain.Cart;
import com.example.backend.domain.response.ResCartDTO;

import java.util.List;

public interface CartService {
    public Cart handleCreateCart(Cart cart);
    public List<ResCartDTO> handleGetAllCart();
    public ResCartDTO handleGetCartById(Long id);
    public ResCartDTO handleUpdateCart(Long id, Cart cart);
    public void handleDeleteCart(Long id);
}
