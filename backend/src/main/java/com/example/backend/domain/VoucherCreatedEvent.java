package com.example.backend.domain;

public class VoucherCreatedEvent {
    private final Long voucherId;

    public VoucherCreatedEvent(Long voucherId) {
        this.voucherId = voucherId;
    }

    public Long getVoucherId() {
        return voucherId;
    }
}
