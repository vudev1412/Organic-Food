package com.example.backend.service.impl;

import com.example.backend.domain.Cart;
import com.example.backend.domain.response.CartItemDTO;
import com.example.backend.domain.response.ResCartDTO;
import com.example.backend.mapper.CartMapper;
import com.example.backend.repository.CartRepository;
import com.example.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

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
    @Override
    public List<CartItemDTO> getCartItemsByUserId(Long userId) {
        List<Object[]> rawData = cartRepository.fetchCartItemsRaw(userId);

        // Convert List<Object[]> -> List<CartItemDTO>
        return rawData.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Hàm helper để chuyển đổi từng dòng dữ liệu
    private CartItemDTO mapToDTO(Object[] row) {
        CartItemDTO dto = new CartItemDTO();

        // Thứ tự index [0], [1]... phải khớp y hệt thứ tự SELECT trong SQL
        // SELECT id, product_name, slug, image, originalPrice, price, quantity, promo_id, promo_type, value

        dto.setId(castToLong(row[0]));
        dto.setProductName((String) row[1]);
        dto.setSlug((String) row[2]);
        dto.setImage((String) row[3]);

        dto.setOriginalPrice(convertToBigDecimal(row[4]));
        dto.setPrice(convertToBigDecimal(row[5]));

        dto.setQuantity((Integer) row[6]);

        dto.setPromotionId(castToLong(row[7]));
        dto.setPromotionType((String) row[8]);
        dto.setValue((Double) row[9]);
        dto.setStock((Integer) row[10]);
        return dto;
    }

    // Hàm an toàn để ép kiểu Long (tránh lỗi BigInteger cannot be cast to Long của MySQL)
    private Long castToLong(Object obj) {
        return obj != null ? ((Number) obj).longValue() : null;
    }

    private BigDecimal convertToBigDecimal(Object obj) {
        if (obj == null) {
            return null;
        }
        if (obj instanceof BigDecimal bd) {
            return bd;
        }
        return BigDecimal.valueOf(((Number) obj).doubleValue());
    }

}
