package com.example.backend.service.impl;

import com.example.backend.domain.Cart;
import com.example.backend.domain.response.ResCartDTO;
import com.example.backend.mapper.CartMapper;
import com.example.backend.repository.CartRepository;
import com.example.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartMapper cartMapper;
    @Override
    public Cart handleCreateCart(Cart cart) {
        return this.cartRepository.save(cart);
    }

    @Override
    public List<ResCartDTO> handleGetAllCart() {
        return this.cartRepository.findAll().stream().map(this.cartMapper::toResCartDTO).toList();
    }

    @Override
    public ResCartDTO handleGetCartById(Long id) {
        Cart cart = this.cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));
        return this.cartMapper.toResCartDTO(cart);
    }

    @Override
    public ResCartDTO handleUpdateCart(Long id, Cart cart) {
        Cart currentCart = this.cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));

        currentCart.setCreatedAt(cart.getCreatedAt());
        currentCart.setUpdatedAt(cart.getUpdatedAt());
        this.cartRepository.save(currentCart);

        return this.cartMapper.toResCartDTO(currentCart);
    }

    @Override
    public void handleDeleteCart(Long id) {
        this.cartRepository.deleteById(id);
    }
}
