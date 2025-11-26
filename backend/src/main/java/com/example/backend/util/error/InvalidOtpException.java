package com.example.backend.util.error;

public class InvalidOtpException extends Exception {
    public InvalidOtpException(String message) {
        super(message);
    }
}