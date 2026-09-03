package com.employeemanagement.service.impl;

import com.employeemanagement.dto.EmployeeRequestDto;
import com.employeemanagement.dto.EmployeeResponseDto;
import com.employeemanagement.exception.BadRequestException;
import com.employeemanagement.exception.ResourceNotFoundException;
import com.employeemanagement.model.Department;
import com.employeemanagement.model.Employee;
import com.employeemanagement.model.EmploymentStatus;
import com.employeemanagement.repository.EmployeeRepository;
import com.employeemanagement.service.EmployeeService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<EmployeeResponseDto> getAllEmployees(Department department, EmploymentStatus employmentStatus, String search) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        List<Employee> employees = employeeRepository.searchAndFilterEmployees(department, employmentStatus, cleanSearch);
        return employees.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public EmployeeResponseDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return mapToDto(employee);
    }

    @Override
    public EmployeeResponseDto createEmployee(EmployeeRequestDto employeeDto) {
        if (employeeRepository.existsByEmail(employeeDto.getEmail())) {
            throw new BadRequestException("An employee with email '" + employeeDto.getEmail() + "' already exists");
        }

        Employee employee = mapToEntity(employeeDto);
        Employee savedEmployee = employeeRepository.save(employee);
        return mapToDto(savedEmployee);
    }

    @Override
    public EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto employeeDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        if (employeeRepository.existsByEmailAndIdNot(employeeDto.getEmail(), id)) {
            throw new BadRequestException("An employee with email '" + employeeDto.getEmail() + "' already exists");
        }

        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setEmail(employeeDto.getEmail());
        employee.setDepartment(employeeDto.getDepartment());
        employee.setEmploymentStatus(employeeDto.getEmploymentStatus());
        employee.setPhoneNumber(employeeDto.getPhoneNumber());
        employee.setSalary(employeeDto.getSalary());

        Employee updatedEmployee = employeeRepository.save(employee);
        return mapToDto(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        employeeRepository.delete(employee);
    }

    @Override
    public List<Department> getAllDepartments() {
        return Arrays.asList(Department.values());
    }

    @Override
    public List<EmploymentStatus> getAllStatuses() {
        return Arrays.asList(EmploymentStatus.values());
    }

    private EmployeeResponseDto mapToDto(Employee employee) {
        return new EmployeeResponseDto(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getDepartment(),
                employee.getEmploymentStatus(),
                employee.getPhoneNumber(),
                employee.getSalary(),
                employee.getCreatedAt(),
                employee.getUpdatedAt()
        );
    }

    private Employee mapToEntity(EmployeeRequestDto dto) {
        return new Employee(
                dto.getFirstName(),
                dto.getLastName(),
                dto.getEmail(),
                dto.getDepartment(),
                dto.getEmploymentStatus(),
                dto.getPhoneNumber(),
                dto.getSalary()
        );
    }
}
