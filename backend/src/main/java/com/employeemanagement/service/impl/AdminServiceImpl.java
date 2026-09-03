package com.employeemanagement.service.impl;

import com.employeemanagement.dto.UserApprovalDto;
import com.employeemanagement.exception.ResourceNotFoundException;
import com.employeemanagement.model.*;
import com.employeemanagement.repository.EmployeeRepository;
import com.employeemanagement.repository.UserRepository;
import com.employeemanagement.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public AdminServiceImpl(UserRepository userRepository, EmployeeRepository employeeRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<UserApprovalDto> getPendingUsers() {
        List<User> pendingUsers = userRepository.findByStatus(UserStatus.PENDING);
        return pendingUsers.stream()
                .map(u -> new UserApprovalDto(u.getId(), u.getUsername(), u.getEmail(), u.getRole(), u.getStatus(), u.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public String approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setStatus(UserStatus.APPROVED);
        userRepository.save(user);

        // Auto-create Employee record if not existing so the user appears immediately in the UI table
        if (!employeeRepository.existsByEmail(user.getEmail())) {
            String firstName = user.getUsername().substring(0, 1).toUpperCase() + user.getUsername().substring(1);
            Employee employee = new Employee(
                    firstName,
                    "Member",
                    user.getEmail(),
                    Department.ENGINEERING,
                    EmploymentStatus.FULL_TIME,
                    "+1-555-0199",
                    75000.00
            );
            employeeRepository.save(employee);
        }

        return "User account '" + user.getUsername() + "' approved and added to active employees!";
    }

    @Override
    public String declineUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setStatus(UserStatus.DECLINED);
        userRepository.save(user);
        return "User account '" + user.getUsername() + "' has been declined.";
    }
}
