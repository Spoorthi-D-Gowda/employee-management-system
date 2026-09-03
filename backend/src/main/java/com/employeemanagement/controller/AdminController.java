package com.employeemanagement.controller;

import com.employeemanagement.dto.UserApprovalDto;
import com.employeemanagement.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<UserApprovalDto>> getPendingUsers() {
        return ResponseEntity.ok(adminService.getPendingUsers());
    }

    @PutMapping("/{userId}/approve")
    public ResponseEntity<Map<String, String>> approveUser(@PathVariable Long userId) {
        String message = adminService.approveUser(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/decline")
    public ResponseEntity<Map<String, String>> declineUser(@PathVariable Long userId) {
        String message = adminService.declineUser(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}
