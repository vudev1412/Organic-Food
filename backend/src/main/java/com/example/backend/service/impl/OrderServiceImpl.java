package com.example.backend.service.impl;

import com.example.backend.domain.*;
import com.example.backend.domain.key.OrderDetailKey;
import com.example.backend.domain.request.*;
import com.example.backend.domain.response.*;

import com.example.backend.enums.StatusInvoice;
import com.example.backend.enums.StatusOrder;
import com.example.backend.enums.StatusPayment;
import com.example.backend.mapper.OrderMapper;
import com.example.backend.repository.*;
import com.example.backend.service.CustomerProfileService;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import com.example.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
    private RoleRepository roleRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserService userService;
    private final VoucherRepository voucherRepository;

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
        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Role CUSTOMER không tồn tại"));

        // ➤ Tạo User mới
        User newUser = new User();
        newUser.setName(customerDTO.getName());
        newUser.setEmail(customerDTO.getEmail());
        newUser.setPhone(customerDTO.getPhone());
        newUser.setRole(customerRole); // 🎯 GÁN ROLE ENTITY

        // Tạo mật khẩu random
        String randomPassword = UUID.randomUUID().toString().substring(0, 8);
        newUser.setPassword(passwordEncoder.encode(randomPassword));

        // ➤ Lưu User trước (để có ID)
        User savedUser = userRepository.save(newUser);

        // ➤ Tạo CustomerProfile
        CustomerProfile customerProfile = new CustomerProfile();
        customerProfile.setMember(true);
        customerProfile.setUser(savedUser);

        customerProfileService.handleCreateCustomerProfile(customerProfile);

        return savedUser;
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

        // 1. Map danh sách Order Details sang cấu trúc mới (ResOrderDetailItem)
        List<ResOrderDTO.ResOrderDetailItem> orderDetailItems = order.getOrderDetails().stream()
                .map(od -> ResOrderDTO.ResOrderDetailItem.builder()
                        .productId(od.getProduct().getId())
                        .productName(od.getProduct().getName())
                        // Nếu product có ảnh thì lấy, không thì null hoặc string rỗng
                        .productImage(od.getProduct().getImage())
                        // Nếu product có slug thì lấy
                        .productSlug(od.getProduct().getSlug())
                        .quantity(od.getQuantity())
                        .price(od.getPrice())
                        .build())
                .collect(Collectors.toList());

        // 2. Map các thông tin còn lại của Order
        ResOrderDTO.ResOrderDTOBuilder builder = ResOrderDTO.builder()
                .id(order.getId())
                .orderAt(order.getOrderAt())
                .note(order.getNote())
                .statusOrder(order.getStatusOrder())
                .shipAddress(order.getShipAddress())
                .estimatedDate(order.getEstimatedDate())
                .actualDate(order.getActualDate())
                // Tách user ID nếu có
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                // Gán danh sách detail mới
                .orderDetails(orderDetailItems);

        // 3. Map thông tin tài chính từ Invoice (Để Admin cũng xem được chi tiết tiền)
        if (order.getInvoice() != null) {
            builder.totalPrice(order.getInvoice().getTotal());
            builder.subtotal(order.getInvoice().getSubtotal());
            builder.shippingFee(order.getInvoice().getDeliverFee());
            builder.taxAmount(order.getInvoice().getTaxAmount());
            builder.discountAmount(order.getInvoice().getDiscountAmount());

            if (order.getInvoice().getPayment() != null) {
                builder.paymentMethod(order.getInvoice().getPayment().getMethod());
                builder.paymentStatus(order.getInvoice().getPayment().getStatus().name());
            }
        }

        return builder.build();
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
    @Override
    @Transactional(readOnly = true)
    public List<ResOrderDTO> getOrdersByUserId(Long userId) {
        // Lấy orders với đầy đủ orderDetails và product
        List<Order> orders = orderRepository.findByUserIdWithDetails(userId);

        // Convert sang DTO
        return orders.stream()
                .map(this::convertToResOrderDTO)
                .collect(Collectors.toList());
    }
    // --- 1. LOGIC ĐẶT HÀNG (KÈM TRỪ TỒN KHO) ---
    @Override
    @Transactional
    public ResCreateUserOrderDTO handlePlaceUserOrder(CreateUserOrderDTO reqDTO) {

        // --- BƯỚC 1: LẤY USER HIỆN TẠI ---
        String currentUserEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Người dùng chưa đăng nhập"));
        User currentUser = userService.handleGetUserByUsername(currentUserEmail);

        // --- BƯỚC 2: TẠO ORDER (MASTER) ---
        Order order = new Order();
        order.setOrderAt(Instant.now());
        order.setNote(reqDTO.getNote());
        order.setStatusOrder(StatusOrder.PENDING);
        order.setUser(currentUser); // Gán User vào Order

        // Gộp địa chỉ giao hàng đầy đủ
        String fullAddress = String.format("%s - %s - %s",
                reqDTO.getReceiverName(),
                reqDTO.getReceiverPhone(),
                reqDTO.getShipAddress());
        order.setShipAddress(fullAddress);

        // Tính ngày dự kiến giao (Cộng 3 ngày)
        order.setEstimatedDate(Instant.now().plus(3, ChronoUnit.DAYS));
        order.setActualDate(null); // Chưa giao xong

        Order savedOrder = orderRepository.save(order);

        // --- BƯỚC 3: XỬ LÝ ORDER DETAIL & TRỪ TỒN KHO ---
        if (reqDTO.getCartItems() != null) {
            List<OrderDetail> details = new ArrayList<>();
            for (CreateUserOrderDTO.CartItemDTO item : reqDTO.getCartItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại ID: " + item.getProductId()));

                // Kiểm tra tồn kho
                if (product.getQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng (Còn: " + product.getQuantity() + ")");
                }

                // Trừ kho
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);

                // Tạo OrderDetail
                OrderDetail detail = new OrderDetail();
                OrderDetailKey key = new OrderDetailKey(savedOrder.getId(), product.getId());
                detail.setId(key);
                detail.setOrder(savedOrder);
                detail.setProduct(product);
                detail.setQuantity(item.getQuantity());
                detail.setPrice(item.getPrice());

                details.add(detail);
            }
            orderDetailRepository.saveAll(details);
        }

        // --- BƯỚC 4: TẠO INVOICE & XỬ LÝ VOUCHER ---
        Invoice invoice = new Invoice();
        invoice.setOrder(savedOrder);
        invoice.setCustomer(currentUser); // Lưu user vào invoice
        invoice.setCreateAt(Instant.now());

        // Lưu các thông tin tiền tệ chi tiết từ Frontend gửi xuống
        invoice.setSubtotal(reqDTO.getSubtotal());         // Tiền hàng
        invoice.setDeliverFee(reqDTO.getShippingFee());    // Phí ship
        invoice.setDiscountAmount(reqDTO.getDiscountAmount()); // Giảm giá
        invoice.setTaxAmount(reqDTO.getTaxAmount());       // Thuế
        invoice.setTotal(reqDTO.getTotalPrice());          // Tổng cuối cùng

        // Xử lý Voucher (nếu có)
        if (reqDTO.getVoucherId() != null) {
            Voucher voucher = voucherRepository.findById(reqDTO.getVoucherId()).orElse(null);
            if (voucher != null) {
                invoice.setVoucher(voucher);
                // Tăng số lượt đã sử dụng
                voucher.setUsedCount(voucher.getUsedCount() + 1);
                voucherRepository.save(voucher);
            }
        }

        // --- BƯỚC 5: XỬ LÝ THANH TOÁN (PAYMENT) ---
        String currentPaymentStatus = "PENDING";

        if ("COD".equals(reqDTO.getPaymentMethod())) {
            // Trường hợp COD: Tạo Payment ngay -> Provider GHTK
            Payment payment = new Payment();
            payment.setMethod("COD");
            payment.setProvider("GHTK"); // Mặc định GHTK cho COD
            payment.setAmount(reqDTO.getTotalPrice());
            payment.setStatus(StatusPayment.PENDING);
            payment.setCreateAt(Instant.now());

            payment = paymentRepository.save(payment);

            invoice.setPayment(payment);
            invoice.setStatus(StatusInvoice.UNPAID);
        } else {
            // Trường hợp BANK_TRANSFER:
            // Chưa tạo Payment ở đây, Invoice.payment = null
            // Frontend sẽ gọi API /payments/create để tạo Payment sau và link vào Invoice này
            invoice.setPayment(null);
            invoice.setStatus(StatusInvoice.UNPAID);
        }

        invoiceRepository.save(invoice);

        // --- BƯỚC 6: TRẢ VỀ DTO CHO FRONTEND ---
        return ResCreateUserOrderDTO.builder()
                .id(savedOrder.getId())
                .totalPrice(invoice.getTotal())
                .paymentMethod(reqDTO.getPaymentMethod())
                .receiverName(reqDTO.getReceiverName())
                .receiverPhone(reqDTO.getReceiverPhone())
                .address(reqDTO.getShipAddress())
                .paymentStatus(currentPaymentStatus)
                .build();
    }

    // --- 2. LOGIC HỦY ĐƠN (KÈM HOÀN TỒN KHO) ---
    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        // Chỉ cho hủy khi đang PENDING hoặc CONFIRMED (Tùy nghiệp vụ)
        if (order.getStatusOrder() == StatusOrder.CANCELLED || order.getStatusOrder() == StatusOrder.SHIPPING || order.getStatusOrder() == StatusOrder.DELIVERED) {
            throw new RuntimeException("Không thể hủy đơn hàng ở trạng thái này.");
        }

        // Hoàn lại số lượng tồn kho
        List<OrderDetail> details = order.getOrderDetails();
        if (details != null) {
            for (OrderDetail detail : details) {
                Product product = detail.getProduct();
                product.setQuantity(product.getQuantity() + detail.getQuantity());
                productRepository.save(product);
            }
        }

        // Cập nhật trạng thái Order
        order.setStatusOrder(StatusOrder.CANCELLED);

        // Cập nhật trạng thái Invoice (nếu cần thiết để đối soát)
        if (order.getInvoice() != null) {
            order.getInvoice().setStatus(StatusInvoice.CANCELLED);
            invoiceRepository.save(order.getInvoice());
        }

        orderRepository.save(order);
    }
    @Override
    public ResOrderDTO convertToResOrderDTOv2(Order order) {
        // 1. Builder cơ bản từ Order Entity
        ResOrderDTO.ResOrderDTOBuilder builder = ResOrderDTO.builder()
                .id(order.getId())
                .orderAt(order.getOrderAt())
                .note(order.getNote())
                .statusOrder(order.getStatusOrder())
                .shipAddress(order.getShipAddress())
                .estimatedDate(order.getEstimatedDate())
                .actualDate(order.getActualDate());

        // 2. Tách thông tin người nhận (Nếu shipAddress lưu dạng "Tên - SĐT - Địa chỉ")
        if (order.getShipAddress() != null) {
            String[] parts = order.getShipAddress().split(" - ", 3);
            if (parts.length >= 2) {
                builder.receiverName(parts[0]);
                builder.receiverPhone(parts[1]);
            } else {
                // Fallback nếu không tách được
                builder.receiverName("Khách hàng");
                builder.receiverPhone("");
            }
        }

        // 3. Map danh sách Order Details
        if (order.getOrderDetails() != null) {
            List<ResOrderDTO.ResOrderDetailItem> items = order.getOrderDetails().stream()
                    .map(detail -> ResOrderDTO.ResOrderDetailItem.builder()
                            .productId(detail.getProduct().getId())
                            .productName(detail.getProduct().getName())
                            .productImage(detail.getProduct().getImage()) // Lấy ảnh
                            .productSlug(detail.getProduct().getSlug())   // Lấy slug
                            .quantity(detail.getQuantity())
                            .price(detail.getPrice())
                            .build())
                    .toList();
            builder.orderDetails(items);
        }

        // 4. Map thông tin tài chính từ Invoice (QUAN TRỌNG)
        if (order.getInvoice() != null) {
            builder.totalPrice(order.getInvoice().getTotal());
            builder.subtotal(order.getInvoice().getSubtotal());
            builder.shippingFee(order.getInvoice().getDeliverFee());
            builder.taxAmount(order.getInvoice().getTaxAmount());
            builder.discountAmount(order.getInvoice().getDiscountAmount());

            // Payment Info
            if (order.getInvoice().getPayment() != null) {
                builder.paymentMethod(order.getInvoice().getPayment().getMethod());
                builder.paymentStatus(order.getInvoice().getPayment().getStatus().name());
            } else {
                // Mặc định nếu chưa có payment (ví dụ Bank Transfer đang chờ tạo)
                builder.paymentMethod("BANK_TRANSFER");
                builder.paymentStatus("PENDING");
            }
        }

        return builder.build();
    }
}
