package com.example.backend.config;

import com.example.backend.domain.User;
import com.example.backend.domain.Voucher;
import com.example.backend.domain.VoucherCreatedEvent;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VoucherRepository;
import com.example.backend.service.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;
@Slf4j
@Component
public class VoucherEventListener {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService emailService;


    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleVoucherCreated(VoucherCreatedEvent event) {
        Voucher voucher = voucherRepository.findById(event.getVoucherId())
                .orElseThrow();

        List<User> customers = userRepository.findAllActiveCustomers();

        for (User user : customers) {
            try {
                emailService.sendVoucherEmail(user.getEmail(), voucher);
            } catch (Exception e) {
                log.error("Failed to send email to {}: {}", user.getEmail(), e.getMessage());
            }
        }
    }
}
