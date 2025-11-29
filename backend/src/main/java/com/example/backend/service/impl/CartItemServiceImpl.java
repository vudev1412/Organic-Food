package com.example.backend.service.impl;

import com.example.backend.domain.Cart;
import com.example.backend.domain.CartItem;
import com.example.backend.domain.Product;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCartItemDTO;
import com.example.backend.domain.response.ResCartItemDTO;
import com.example.backend.mapper.CartItemMapper;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CartItemService;
import com.example.backend.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final CartItemMapper cartItemMapper;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
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
    @Override
    public void addToCart(Long cartId, Long productId, int quantity) {
        // 1. Kiểm tra xem sản phẩm này đã có trong giỏ chưa
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cartId, productId);

        if (existingItem.isPresent()) {
            // 2. NẾU CÓ RỒI: Chỉ cộng dồn số lượng (Update)
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            // 3. NẾU CHƯA CÓ: Tạo dòng mới (Insert) - Đây là lúc ID mới được tạo
            CartItem newItem = new CartItem();
            newItem.setCart(cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found")));
            newItem.setProduct(productRepository.findById(productId).orElseThrow());
            newItem.setQuantity(quantity);
            newItem.setAddedAt(Instant.now());
            cartItemRepository.save(newItem);
        }
    }
    @Override
    public ResCartItemDTO handleAddCartItem(ReqCartItemDTO req) throws IdInvalidException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 1. Tìm hoặc Tạo Cart
        Cart cart = this.cartRepository.findByUser_Email(email).orElseGet(() -> {
            User user = this.userRepository.findByEmail(email);
            Cart newCart = new Cart();
            newCart.setUser(user);
            // newCart.setSum(0);  <-- ĐÃ XÓA DÒNG NÀY
            newCart.setCreatedAt(Instant.now());
            return this.cartRepository.save(newCart);
        });

        Product product = this.productRepository.findById(req.getProductId())
                .orElseThrow(() -> new IdInvalidException("Product không tồn tại"));

        // 2. Kiểm tra tồn tại + Tồn kho
        Optional<CartItem> existingItemOpt = this.cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        int currentQuantityInCart = existingItemOpt.map(CartItem::getQuantity).orElse(0);
        int totalDesiredQuantity = currentQuantityInCart + req.getQuantity();

        // Giả sử Product có field 'quantity' là tồn kho
        if (product.getQuantity() < totalDesiredQuantity) {
            throw new IdInvalidException("Sản phẩm này chỉ còn " + product.getQuantity() + " cái.");
        }

        // 3. Lưu CartItem
        CartItem savedCartItem;
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(totalDesiredQuantity);
            savedCartItem = this.cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(req.getQuantity());
            newItem.setAddedAt(Instant.now());
            savedCartItem = this.cartItemRepository.save(newItem);
        }

        // (ĐÃ XÓA đoạn code update cart sum ở đây)

        // 4. Trả về kết quả
        ResCartItemDTO res = new ResCartItemDTO();
        res.setId(savedCartItem.getId());
        res.setQuantity(savedCartItem.getQuantity());
        res.setCartId(cart.getId());
        res.setProductId(product.getId());
        res.setAddedAt(savedCartItem.getAddedAt());
        return res;
    }
    @Override
    public ResCartItemDTO handleUpdateCartItem(ReqCartItemDTO req) throws IdInvalidException {
        // 1. Lấy User từ Token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Tìm Giỏ hàng của User này
        Cart cart = this.cartRepository.findByUser_Email(email)
                .orElseThrow(() -> new IdInvalidException("Giỏ hàng không tồn tại (User chưa có giỏ)"));

        // 3. Tìm sản phẩm trong giỏ hàng đó
        // (Dùng ProductID gửi từ frontend + CartID vừa tìm được)
        CartItem currentItem = this.cartItemRepository.findByCartIdAndProductId(cart.getId(), req.getProductId())
                .orElseThrow(() -> new IdInvalidException("Sản phẩm này không có trong giỏ hàng của bạn"));

        // 4. Xử lý logic số lượng (Giống hệt bài trước)
        if (req.getQuantity() <= 0) {
            // Nếu số lượng <= 0 -> Xóa luôn
            this.cartItemRepository.delete(currentItem);
            return null;
        } else {
            // Kiểm tra tồn kho nếu cần...
            Product product = currentItem.getProduct();
            if (product.getQuantity() < req.getQuantity()) {
                throw new IdInvalidException("Kho không đủ hàng. Chỉ còn " + product.getQuantity());
            }

            // Cập nhật số lượng mới
            currentItem.setQuantity(req.getQuantity());
            CartItem savedItem = this.cartItemRepository.save(currentItem);

            // 5. Trả về DTO
            ResCartItemDTO res = new ResCartItemDTO();
            res.setId(savedItem.getId());
            res.setQuantity(savedItem.getQuantity());
            res.setCartId(savedItem.getCart().getId());
            res.setProductId(savedItem.getProduct().getId());
            res.setAddedAt(savedItem.getAddedAt());
            // Set thêm thông tin product để frontend hiển thị lại


            return res;
        }
    }
    @Override
    @Transactional
    public void handleDeleteAllCartItemsByCartId(Long cartId) throws IdInvalidException {

        // Kiểm tra cart có tồn tại
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IdInvalidException("Cart ID không tồn tại"));

        // Xóa toàn bộ cartItem thuộc cart
        cartItemRepository.deleteAllByCartId(cartId);

        // Cập nhật timestamp
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
    }
    @Override
    @Transactional
    public void handleDeleteAllCartItemsByUserId(Long userId) throws IdInvalidException {

        // Kiểm tra user có tồn tại không
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IdInvalidException("User ID không tồn tại"));

        // Lấy cart theo user
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IdInvalidException("Cart không tồn tại cho User này"));

        // Xóa CartItem theo cart.id
        cartItemRepository.deleteAllByCartId(cart.getId());

        // Cập nhật timestamp
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
    }


}
