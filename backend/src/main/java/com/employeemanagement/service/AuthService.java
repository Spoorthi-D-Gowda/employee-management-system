package com.employeemanagement.service;

import com.employeemanagement.dto.*;

import java.util.Map;

public interface AuthService {
    JwtAuthResponse login(LoginRequest loginRequest);
    String register(RegisterRequest registerRequest);
    Map<String, String> forgotPassword(ForgotPasswordRequest request);
    String resetPassword(ResetPasswordRequest request);
}
