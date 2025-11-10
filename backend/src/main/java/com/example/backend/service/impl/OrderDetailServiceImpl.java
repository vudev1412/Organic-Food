package com.example.backend.service.impl;

import com.example.backend.domain.Order;
import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.Product;
import com.example.backend.domain.key.OrderDetailKey;
import com.example.backend.domain.request.ReqOrderDetail;
import com.example.backend.domain.response.ResOrderDetailDTO;
import com.example.backend.mapper.OrderDetailMapper;
import com.example.backend.repository.OrderDetailRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailServiceImpl implements OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderDetailMapper orderDetailMapper;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public ResOrderDetailDTO createOrderDetail(ReqOrderDetail req) {
        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        OrderDetail od = new OrderDetail();
        od.setId(new OrderDetailKey(req.getOrderId(), req.getProductId()));
        od.setOrder(order);
        od.setProduct(product);
        od.setQuantity(req.getQuantity());
        od.setPrice(req.getPrice());

        orderDetailRepository.save(od);
        return orderDetailMapper.toResOrderDetailDTO(od);
    }

    @Override
    public List<ResOrderDetailDTO> getAllOrderDetails() {
        return orderDetailRepository.findAll()
                .stream()
                .map(orderDetailMapper::toResOrderDetailDTO)
                .toList();
    }

    @Override
    public ResOrderDetailDTO getOrderDetailById(Long orderId, Long productId) {
        OrderDetailKey key = new OrderDetailKey(orderId, productId);
        OrderDetail od = orderDetailRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("Not found OrderDetail with orderId=" + orderId + " and productId=" + productId));
        return orderDetailMapper.toResOrderDetailDTO(od);
    }

    @Override
    public ResOrderDetailDTO updateOrderDetail(Long orderId, Long productId, OrderDetail orderDetail) {
        OrderDetailKey key = new OrderDetailKey(orderId, productId);
        OrderDetail current = orderDetailRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("Not found OrderDetail with orderId=" + orderId + " and productId=" + productId));

        if(current.getPrice() != 0){
            current.setPrice(orderDetail.getPrice());
        }
        if(current.getQuantity() != 0){
            current.setQuantity(orderDetail.getQuantity());

        }


        orderDetailRepository.save(current);
        return orderDetailMapper.toResOrderDetailDTO(current);
    }

    @Override
    public void deleteOrderDetail(Long orderId, Long productId) {
        OrderDetailKey key = new OrderDetailKey(orderId, productId);
        orderDetailRepository.deleteById(key);
    }
}
