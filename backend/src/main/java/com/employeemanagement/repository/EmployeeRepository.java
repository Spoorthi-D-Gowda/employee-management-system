package com.employeemanagement.repository;

import com.employeemanagement.model.Department;
import com.employeemanagement.model.Employee;
import com.employeemanagement.model.EmploymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Boolean existsByEmail(String email);

    Boolean existsByEmailAndIdNot(String email, Long id);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:dept IS NULL OR e.department = :dept) AND " +
           "(:status IS NULL OR e.employmentStatus = :status) AND " +
           "(:search IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Employee> searchAndFilterEmployees(
            @Param("dept") Department department,
            @Param("status") EmploymentStatus employmentStatus,
            @Param("search") String search);
}
