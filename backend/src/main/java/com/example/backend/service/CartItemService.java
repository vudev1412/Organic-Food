package com.example.backend.service;

import com.example.backend.domain.CartItem;
import com.example.backend.domain.request.ReqCartItemDTO;
import com.example.backend.domain.response.ResCartItemDTO;
import com.example.backend.util.error.IdInvalidException;

import java.util.List;

public interface CartItemService {
    public CartItem handleCreateCartItem(CartItem cartItem);
    public ResCartItemDTO handleGetCartItemById(Long id);
    public List<ResCartItemDTO> handleGetAllCartItem();
    public ResCartItemDTO handleUpdateCartItem(Long id, CartItem cartItem);
    public void handleDeleteCartItem(Long id);
    public void addToCart(Long cartId, Long productId, int quantity) ;
    public ResCartItemDTO handleAddCartItem(ReqCartItemDTO req) throws IdInvalidException;
    public ResCartItemDTO handleUpdateCartItem(ReqCartItemDTO req) throws IdInvalidException;
    void handleDeleteAllCartItemsByCartId(Long cartId) throws IdInvalidException;
    void handleDeleteAllCartItemsByUserId(Long userId) throws IdInvalidException;


}
