package com.employeemanagement.service.impl;

import com.employeemanagement.dto.*;
import com.employeemanagement.exception.BadRequestException;
import com.employeemanagement.model.Role;
import com.employeemanagement.model.User;
import com.employeemanagement.model.UserStatus;
import com.employeemanagement.repository.UserRepository;
import com.employeemanagement.security.JwtTokenProvider;
import com.employeemanagement.service.AuthService;
import com.employeemanagement.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider,
                           EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    @Override
    public JwtAuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsernameOrEmail(), loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        // Check user status (PENDING / DECLINED / APPROVED)
        if (user.getStatus() == UserStatus.PENDING) {
            throw new BadRequestException("Your account registration is pending administrator approval. Please wait for an admin to accept your request.");
        } else if (user.getStatus() == UserStatus.DECLINED) {
            throw new BadRequestException("Your account registration request has been declined by an administrator.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        return new JwtAuthResponse(token, user.getUsername(), user.getEmail(), user.getRole());
    }

    @Override
    public String register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username '" + registerRequest.getUsername() + "' is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email '" + registerRequest.getEmail() + "' is already registered!");
        }

        Role userRole = registerRequest.getRole() != null ? registerRequest.getRole() : Role.ROLE_USER;
        UserStatus status = (userRole == Role.ROLE_ADMIN) ? UserStatus.APPROVED : UserStatus.PENDING;

        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                userRole,
                status
        );

        userRepository.save(user);

        if (status == UserStatus.PENDING) {
            return "Registration submitted successfully! Your account is pending administrator approval.";
        } else {
            return "Administrator account registered and activated successfully!";
        }
    }

    @Override
    public Map<String, String> forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No account found with email: " + request.getEmail()));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);
        user.setResetOtp(otp);
        user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Send OTP via Email Service
        emailService.sendOtpEmail(user.getEmail(), otp);

        Map<String, String> response = new HashMap<>();
        response.put("message", "A 6-digit OTP verification code has been sent to " + request.getEmail() + ". Please check your inbox.");
        return response;
    }

    @Override
    public String resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No account found with email: " + request.getEmail()));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP code. Please verify the code sent to your email and try again.");
        }

        if (user.getResetOtpExpiry() == null || LocalDateTime.now().isAfter(user.getResetOtpExpiry())) {
            throw new BadRequestException("OTP code has expired. Please request a new verification code.");
        }

        // Update Password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        userRepository.save(user);

        return "Password reset successfully! You can now log in with your new password.";
    }
}
