package com.employeemanagement.service.impl;

import com.employeemanagement.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:nexus.emp.system@gmail.com}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("NexusEmp - Password Reset Verification OTP");
            message.setText(
                "Hello,\n\n" +
                "You requested a password reset for your NexusEmp account.\n\n" +
                "Your 6-Digit OTP Verification Code is: " + otpCode + "\n\n" +
                "This code will expire in 15 minutes.\n" +
                "If you did not request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "NexusEmp Security Team"
            );

            mailSender.send(message);
            System.out.println("SUCCESS: Sent OTP email to " + toEmail);
        } catch (Exception e) {
            System.err.println("SMTP Email Dispatch Note: Failed to send via live SMTP server (" + e.getMessage() + ").");
            System.out.println("=========================================================================");
            System.out.println("OTP CODE FOR " + toEmail + ": " + otpCode);
            System.out.println("=========================================================================");
        }
    }
}
