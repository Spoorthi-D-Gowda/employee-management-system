package com.employeemanagement.service;

import com.employeemanagement.dto.UserApprovalDto;
import java.util.List;

public interface AdminService {
    List<UserApprovalDto> getPendingUsers();
    String approveUser(Long userId);
    String declineUser(Long userId);
}
