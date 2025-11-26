package com.example.backend.service;

import com.example.backend.config.VNPAYConfig;
import com.example.backend.domain.request.PaymentDTO;
import com.example.backend.util.VNPAYUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class VNPayService {

    private final VNPAYConfig config;

    public PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request) {

        Map<String, String> vnpParams = config.getVNPayConfig();

        String amount = request.getParameter("amount");
        if (amount == null) amount = "10000";

        vnpParams.put("vnp_Amount", String.valueOf(Integer.parseInt(amount) * 100));
        vnpParams.put("vnp_IpAddr", VNPAYUtil.getIpAddress(request));

        String queryUrl = VNPAYUtil.getPaymentURL(vnpParams, true);
        String hashData = VNPAYUtil.getPaymentURL(vnpParams, false);

        String secureHash = VNPAYUtil.hmacSHA512(config.getSecretKey(), hashData);
        String paymentUrl = config.getVnp_PayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + secureHash;

        return new PaymentDTO.VNPayResponse("00", "success", paymentUrl);
    }
}
