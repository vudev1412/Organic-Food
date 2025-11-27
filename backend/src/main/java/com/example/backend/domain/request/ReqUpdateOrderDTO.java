package com.example.backend.domain.request;

import com.example.backend.enums.StatusOrder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ReqUpdateOrderDTO {
    private String shipAddress;
    private String note;
    private StatusOrder statusOrder;
    private Instant estimatedDate;
    private Instant actualDate;

    // Danh sách sản phẩm (có thể thêm/xóa/sửa)
    private List<ReqOrderDetailItemDTO> orderDetails;

    @Getter
    @Setter
    public static class ReqOrderDetailItemDTO {
        private Long productId;
        private Integer quantity;
    }
}
