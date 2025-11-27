package com.example.backend.service.impl;

import com.example.backend.domain.*;
import com.example.backend.domain.key.OrderDetailKey;
import com.example.backend.domain.request.ReqCreateOrderDTO;
import com.example.backend.domain.request.ReqCustomerDTO;
import com.example.backend.domain.request.ReqOrderDetailItemDTO;
import com.example.backend.domain.request.ReqUpdateOrderDTO;
import com.example.backend.domain.response.*;
import com.example.backend.enums.Role;
import com.example.backend.enums.StatusOrder;
import com.example.backend.mapper.OrderMapper;
import com.example.backend.repository.OrderDetailRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CustomerProfileService;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerProfileService customerProfileService;

    @Transactional
    public ResOrderDTO handleCreateOrder(ReqCreateOrderDTO reqDTO) {
        User customer;

        // ✅ Bước 1: Xử lý Customer
        if (reqDTO.getUserId() != null) {
            // Trường hợp đã có tài khoản
            customer = userRepository.findById(reqDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + reqDTO.getUserId()));
        } else {
            // Trường hợp chưa có tài khoản → Tạo mới
            if (reqDTO.getCustomerDTO() == null) {
                throw new RuntimeException("Phải cung cấp thông tin khách hàng hoặc userId");
            }

            // Check email đã tồn tại chưa
            if (userRepository.existsByEmail(reqDTO.getCustomerDTO().getEmail())) {
                throw new RuntimeException("Email đã tồn tại: " + reqDTO.getCustomerDTO().getEmail());
            }

            customer = createNewCustomer(reqDTO.getCustomerDTO());
        }

        // ✅ Bước 2: Tạo Order
        Order order = new Order();
        order.setOrderAt(Instant.now());
        order.setNote(reqDTO.getNote());
        order.setStatusOrder(StatusOrder.PENDING);
        order.setShipAddress(reqDTO.getShipAddress());
        order.setEstimatedDate(reqDTO.getEstimatedDate());
        order.setUser(customer);

        Order savedOrder = orderRepository.save(order);


        List<OrderDetail> orderDetails = new ArrayList<>();

        for (ReqOrderDetailItemDTO item : reqDTO.getOrderDetails()) {
            // Lấy thông tin sản phẩm
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));

            // Kiểm tra tồn kho
            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm '" + product.getName() +
                        "' không đủ hàng. Còn lại: " + product.getQuantity());
            }

            // Tạo OrderDetail
            OrderDetail orderDetail = new OrderDetail();

            OrderDetailKey key = new OrderDetailKey();
            key.setOrderId(savedOrder.getId());
            key.setProductId(product.getId());
            orderDetail.setId(key);

            orderDetail.setQuantity(item.getQuantity());

            // Tính giá sau giảm giá (nếu có logic promotion thì thêm vào đây)
            double finalPrice = calculateFinalPrice(product);
            orderDetail.setPrice(finalPrice);

            orderDetail.setProduct(product);
            orderDetail.setOrder(savedOrder);

            orderDetails.add(orderDetail);

            // ✅ Cập nhật số lượng tồn kho
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        // Lưu tất cả OrderDetails
        orderDetailRepository.saveAll(orderDetails);

        // ✅ Bước 4: Fetch lại Order với đầy đủ thông tin để trả về
        Order orderWithDetails = orderRepository.findOrderWithDetailsAndProduct(savedOrder.getId())
                .orElseThrow(() -> new RuntimeException("Order not found after creation"));

        return convertToResOrderDTO(orderWithDetails);
    }

    @Transactional
    private User createNewCustomer(ReqCustomerDTO customerDTO) {
        // ✅ Bước 1: Tạo User mới
        User newUser = new User();
        newUser.setName(customerDTO.getName());
        newUser.setEmail(customerDTO.getEmail());
        newUser.setPhone(customerDTO.getPhone());
        newUser.setUserRole(Role.CUSTOMER);

        // Tạo mật khẩu random
        String randomPassword = UUID.randomUUID().toString().substring(0, 8);
        newUser.setPassword(passwordEncoder.encode(randomPassword));

        // ✅ Bước 2: LƯU USER TRƯỚC để có ID
        User savedUser = userRepository.save(newUser);

        // ✅ Bước 3: Tạo CustomerProfile với User đã có ID
        CustomerProfile customerProfile = new CustomerProfile();
        customerProfile.setMember(true);
        customerProfile.setUser(savedUser);

        customerProfileService.handleCreateCustomerProfile(customerProfile);

        // ✅ Trả về User đã lưu
        return savedUser;

        // TODO: Gửi email thông báo mật khẩu cho khách hàng
        // sendWelcomeEmail(savedUser.getEmail(), randomPassword);
    }
    // ✅ Helper: Tính giá cuối cùng (có thể có promotion)
    private double calculateFinalPrice(Product product) {
        // TODO: Thêm logic tính giảm giá từ Promotion nếu có
        return product.getPrice();
    }






    @Transactional(readOnly = true)
    public ResultPaginationDTO getAllOrders(Specification<Order> spec, Pageable pageable) {
        // Bước 1: Lấy danh sách Order (chỉ có thông tin cơ bản)
        Page<Order> pageOrder = orderRepository.findAll(spec, pageable);

        // Bước 2: Lấy IDs của các order
        List<Long> orderIds = pageOrder.getContent().stream()
                .map(Order::getId)
                .collect(Collectors.toList());

        // Bước 3: Fetch orderDetails + product cho các order này
        List<Order> ordersWithDetails = orderRepository.findOrdersWithDetails(orderIds);

        // Bước 4: Convert sang DTO
        List<ResOrderDTO> orderDTOs = ordersWithDetails.stream()
                .map(this::convertToResOrderDTO)
                .collect(Collectors.toList());

        // Bước 5: Tạo ResultPaginationDTO
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageOrder.getTotalPages());
        meta.setTotal(pageOrder.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(orderDTOs);

        return rs;
    }

    // ✅ Helper method: Convert Order Entity → ResOrderDTO
    private ResOrderDTO convertToResOrderDTO(Order order) {
        // Map OrderDetails
        List<ResOrderDetalDTO> orderDetailDTOs = order.getOrderDetails().stream()
                .map(od -> ResOrderDetalDTO.builder()
                        .id(od.getId().getOrderId()) // Hoặc productId tùy logic
                        .quantity(od.getQuantity())
                        .price(od.getPrice())
                        .productId(od.getProduct().getId())
                        .productName(od.getProduct().getName())
                        .productImage(od.getProduct().getImage())
                        .productPrice(od.getProduct().getPrice())
                        .build())
                .collect(Collectors.toList());

        return ResOrderDTO.builder()
                .id(order.getId())
                .orderAt(order.getOrderAt())
                .note(order.getNote())
                .statusOrder(order.getStatusOrder())
                .shipAddress(order.getShipAddress())
                .estimatedDate(order.getEstimatedDate())
                .actualDate(order.getActualDate())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .orderDetails(orderDetailDTOs)
                .build();
    }

    @Override
    public Order handleGetOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return order;
    }

    @Override
    public ResOrderDTO handleUpdateOrder(Long orderId, ReqUpdateOrderDTO reqDTO) {
        Order existingOrder = orderRepository.findOrderWithDetailsAndProduct(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Bước 2: Cập nhật thông tin cơ bản
        if (reqDTO.getShipAddress() != null) {
            existingOrder.setShipAddress(reqDTO.getShipAddress());
        }
        if (reqDTO.getNote() != null) {
            existingOrder.setNote(reqDTO.getNote());
        }
        if (reqDTO.getStatusOrder() != null) {
            existingOrder.setStatusOrder(reqDTO.getStatusOrder());
        }
        if (reqDTO.getEstimatedDate() != null) {
            existingOrder.setEstimatedDate(reqDTO.getEstimatedDate());
        }
        if (reqDTO.getActualDate() != null) {
            existingOrder.setActualDate(reqDTO.getActualDate());
        }

        // Bước 3: Cập nhật OrderDetails (nếu có)
        if (reqDTO.getOrderDetails() != null) {
            updateOrderDetails(existingOrder, reqDTO.getOrderDetails());
        }

        // Bước 4: Lưu Order
        Order updatedOrder = orderRepository.save(existingOrder);

        // Bước 5: Fetch lại để đảm bảo có đầy đủ thông tin
        Order orderWithDetails = orderRepository.findOrderWithDetailsAndProduct(updatedOrder.getId())
                .orElseThrow(() -> new RuntimeException("Order not found after update"));



        return convertToResOrderDTO(orderWithDetails);
    }
    private void updateOrderDetails(Order order, List<ReqUpdateOrderDTO.ReqOrderDetailItemDTO> newDetails) {
        // Lấy danh sách OrderDetail hiện tại
        Map<Long, OrderDetail> existingMap = order.getOrderDetails().stream()
                .collect(Collectors.toMap(od -> od.getProduct().getId(), od -> od));

        // Danh sách productId mới
        Set<Long> newProductIds = newDetails.stream()
                .map(ReqUpdateOrderDTO.ReqOrderDetailItemDTO::getProductId)
                .collect(Collectors.toSet());

        // 1. XÓA những sản phẩm không còn trong danh sách mới
        List<OrderDetail> toRemove = order.getOrderDetails().stream()
                .filter(od -> !newProductIds.contains(od.getProduct().getId()))
                .toList();

        for (OrderDetail od : toRemove) {
            // Hoàn kho
            Product p = od.getProduct();
            p.setQuantity(p.getQuantity() + od.getQuantity());
            productRepository.save(p);

            // Xóa OrderDetail
            orderDetailRepository.delete(od);
            order.getOrderDetails().remove(od);
        }

        // 2. THÊM HOẶC CẬP NHẬT các sản phẩm mới
        for (ReqUpdateOrderDTO.ReqOrderDetailItemDTO item : newDetails) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + item.getProductId()));

            OrderDetail existing = existingMap.get(item.getProductId());

            if (existing != null) {
                // CẬP NHẬT số lượng
                int oldQty = existing.getQuantity();
                int newQty = item.getQuantity();
                int diff = newQty - oldQty;

                if (diff > 0 && product.getQuantity() < diff) {
                    throw new RuntimeException("Không đủ hàng: " + product.getName());
                }

                // Cập nhật tồn kho
                product.setQuantity(product.getQuantity() - diff);
                productRepository.save(product);

                // Cập nhật OrderDetail
                existing.setQuantity(newQty);
                existing.setPrice(calculateFinalPrice(product)); // nếu có giảm giá
            } else {
                // THÊM MỚI OrderDetail
                if (product.getQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Không đủ hàng: " + product.getName());
                }

                OrderDetail newDetail = new OrderDetail();
                OrderDetailKey key = new OrderDetailKey();
                key.setOrderId(order.getId());
                key.setProductId(product.getId());
                newDetail.setId(key);

                newDetail.setQuantity(item.getQuantity());
                newDetail.setPrice(calculateFinalPrice(product));
                newDetail.setOrder(order);
                newDetail.setProduct(product);

                order.getOrderDetails().add(newDetail);

                // Trừ kho
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);
            }
        }
    }

    @Override
    public void handleDeleteOrder(Long orderId, boolean hardDelete) {
        Order order = orderRepository.findOrderWithDetailsAndProduct(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Kiểm tra trạng thái trước khi xóa
        if (order.getStatusOrder() == StatusOrder.DELIVERED ||
                order.getStatusOrder() == StatusOrder.SHIPPING) {
            throw new RuntimeException("Không thể xóa đơn hàng đã hoàn thành hoặc đang giao");
        }

        if (hardDelete) {
            // ✅ Hard Delete: Xóa vĩnh viễn
            hardDeleteOrder(order);
        } else {
            // ✅ Soft Delete: Đổi trạng thái thành CANCELLED
            softDeleteOrder(order);
        }
    }
    private void softDeleteOrder(Order order) {
        // Hoàn trả số lượng vào kho
        for (OrderDetail od : order.getOrderDetails()) {
            Product product = od.getProduct();
            product.setQuantity(product.getQuantity() + od.getQuantity());
            productRepository.save(product);
        }

        // Đổi trạng thái
        order.setStatusOrder(StatusOrder.CANCELLED);
        orderRepository.save(order);


    }

    /**
     * Hard Delete: Xóa vĩnh viễn
     */
    private void hardDeleteOrder(Order order) {
        // Hoàn trả số lượng vào kho
        for (OrderDetail od : order.getOrderDetails()) {
            Product product = od.getProduct();
            product.setQuantity(product.getQuantity() + od.getQuantity());
            productRepository.save(product);
        }

        // Xóa tất cả OrderDetails
        orderDetailRepository.deleteAll(order.getOrderDetails());

        // Xóa Order
        orderRepository.delete(order);


    }

    @Transactional(readOnly = true)
    public List<ResOrderDTO> getOrdersByUserId(Long userId) {
        // Lấy orders với đầy đủ orderDetails và product
        List<Order> orders = orderRepository.findByUserIdWithDetails(userId);

        // Convert sang DTO
        return orders.stream()
                .map(this::convertToResOrderDTO)
                .collect(Collectors.toList());
    }

}
