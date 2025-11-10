package com.example.backend.service.impl;

import com.example.backend.domain.CartItem;
import com.example.backend.domain.response.ResCartItemDTO;
import com.example.backend.mapper.CartItemMapper;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {
    private final CartItemRepository cartItemRepository;
    private final CartItemMapper cartItemMapper;
    @Override
    public CartItem handleCreateCartItem(CartItem cartItem) {
        return this.cartItemRepository.save(cartItem);
    }

    @Override
    public ResCartItemDTO handleGetCartItemById(Long id) {
        CartItem cartItem = this.cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));

        return this.cartItemMapper.toResCartItemDTO(cartItem);
    }

    @Override
    public List<ResCartItemDTO> handleGetAllCartItem() {
        return this.cartItemRepository.findAll().stream().map(this.cartItemMapper::toResCartItemDTO).toList();
    }

    @Override
    public ResCartItemDTO handleUpdateCartItem(Long id, CartItem cartItem) {
        CartItem current = this.cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));

        if(cartItem.getQuantity() > 0){
            current.setQuantity(cartItem.getQuantity());
        }
        if(cartItem.getAddedAt() != null){
            current.setAddedAt(current.getAddedAt());
        }
        this.cartItemRepository.save(current);
        return this.cartItemMapper.toResCartItemDTO(current);
    }

    @Override
    public void handleDeleteCartItem(Long id) {
        this.cartItemRepository.deleteById(id);
    }
}
