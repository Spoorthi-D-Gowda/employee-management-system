package com.employeemanagement.config;

import com.employeemanagement.model.*;
import com.employeemanagement.repository.EmployeeRepository;
import com.employeemanagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           EmployeeRepository employeeRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Users if not present
        if (userRepository.count() == 0) {
            User admin = new User("admin", "admin@company.com", passwordEncoder.encode("admin123"), Role.ROLE_ADMIN, UserStatus.APPROVED);
            User user = new User("user", "user@company.com", passwordEncoder.encode("user123"), Role.ROLE_USER, UserStatus.APPROVED);

            userRepository.saveAll(Arrays.asList(admin, user));
            System.out.println("Default pre-approved accounts initialized: admin/admin123 (ADMIN) and user/user123 (USER)");
        }

        // Seed Employees if not present
        if (employeeRepository.count() == 0) {
            List<Employee> sampleEmployees = Arrays.asList(
                new Employee("Sarah", "Jenkins", "sarah.jenkins@company.com", Department.ENGINEERING, EmploymentStatus.FULL_TIME, "+1-555-0101", 115000.00),
                new Employee("Michael", "Chen", "michael.chen@company.com", Department.ENGINEERING, EmploymentStatus.FULL_TIME, "+1-555-0102", 125000.00),
                new Employee("Emily", "Rodriguez", "emily.rodriguez@company.com", Department.HR, EmploymentStatus.FULL_TIME, "+1-555-0103", 85000.00),
                new Employee("David", "Kim", "david.kim@company.com", Department.FINANCE, EmploymentStatus.CONTRACT, "+1-555-0104", 95000.00),
                new Employee("Jessica", "Taylor", "jessica.taylor@company.com", Department.MARKETING, EmploymentStatus.PART_TIME, "+1-555-0105", 55000.00),
                new Employee("Robert", "Johnson", "robert.johnson@company.com", Department.SALES, EmploymentStatus.FULL_TIME, "+1-555-0106", 90000.00),
                new Employee("Amanda", "White", "amanda.white@company.com", Department.OPERATIONS, EmploymentStatus.INACTIVE, "+1-555-0107", 72000.00),
                new Employee("James", "Wilson", "james.wilson@company.com", Department.ENGINEERING, EmploymentStatus.CONTRACT, "+1-555-0108", 105000.00)
            );

            employeeRepository.saveAll(sampleEmployees);
            System.out.println("Sample employee dataset seeded successfully! Count: " + sampleEmployees.size());
        }
    }
}
