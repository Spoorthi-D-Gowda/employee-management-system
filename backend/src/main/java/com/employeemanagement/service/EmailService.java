package com.employeemanagement.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otpCode);
}
