package com.employeemanagement.service;

import com.employeemanagement.dto.EmployeeRequestDto;
import com.employeemanagement.dto.EmployeeResponseDto;
import com.employeemanagement.model.Department;
import com.employeemanagement.model.EmploymentStatus;

import java.util.List;

public interface EmployeeService {
    List<EmployeeResponseDto> getAllEmployees(Department department, EmploymentStatus employmentStatus, String search);
    EmployeeResponseDto getEmployeeById(Long id);
    EmployeeResponseDto createEmployee(EmployeeRequestDto employeeDto);
    EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto employeeDto);
    void deleteEmployee(Long id);
    List<Department> getAllDepartments();
    List<EmploymentStatus> getAllStatuses();
}
