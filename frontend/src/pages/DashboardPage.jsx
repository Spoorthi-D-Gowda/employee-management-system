import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import EmployeeFilter from '../components/EmployeeFilter';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import ViewEmployeeModal from '../components/ViewEmployeeModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import PendingApprovalsModal from '../components/PendingApprovalsModal';
import Toast from '../components/Toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  // Admin Pending Approvals State
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isApprovalsModalOpen, setIsApprovalsModalOpen] = useState(false);

  // Toast Alert State
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // Fetch Pending Users for Admin
  const fetchPendingUsers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get('/admin/users/pending');
      setPendingUsers(res.data);
    } catch (err) {
      console.error('Error fetching pending approvals:', err);
    }
  }, [isAdmin]);

  // Fetch Departments & Statuses
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [deptRes, statusRes] = await Promise.all([
          api.get('/employees/departments'),
          api.get('/employees/statuses'),
        ]);
        setDepartments(deptRes.data);
        setStatuses(statusRes.data);
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    };
    fetchMetadata();
    if (isAdmin) {
      fetchPendingUsers();
    }
  }, [isAdmin, fetchPendingUsers]);

  // Fetch Employees with Search & Filters
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedDept) params.department = selectedDept;
      if (selectedStatus) params.employmentStatus = selectedStatus;

      const res = await api.get('/employees', { params });
      setEmployees(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        showToast('error', 'Access Denied: You do not have permission to view records.');
      } else {
        showToast('error', 'Failed to load employees from server.');
      }
    } finally {
      setLoading(false);
    }
  }, [search, selectedDept, selectedStatus]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEmployees();
    }, 200);
    return () => clearTimeout(timeout);
  }, [fetchEmployees]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDept('');
    setSelectedStatus('');
  };

  // Admin User Approval Actions
  const handleApproveUser = async (user) => {
    try {
      const res = await api.put(`/admin/users/${user.id}/approve`);
      showToast('success', res.data.message || `User ${user.username} approved!`);
      fetchPendingUsers();
      fetchEmployees(); // Immediately update table & stats on dashboard!
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to approve user.');
    }
  };

  const handleDeclineUser = async (user) => {
    try {
      const res = await api.put(`/admin/users/${user.id}/decline`);
      showToast('success', res.data.message || `User ${user.username} request declined.`);
      fetchPendingUsers();
      fetchEmployees();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to decline user.');
    }
  };

  // Save Employee (Create / Edit)
  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, employeeData);
        showToast('success', `Employee '${employeeData.firstName} ${employeeData.lastName}' updated successfully!`);
      } else {
        await api.post('/employees', employeeData);
        showToast('success', `Employee '${employeeData.firstName} ${employeeData.lastName}' created successfully!`);
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.details?.[0] || 'Operation failed';
      showToast('error', errorMsg);
      throw err;
    }
  };

  // Delete Employee
  const handleDeleteConfirm = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      showToast('success', 'Employee record deleted successfully.');
      setIsDeleteModalOpen(false);
      setDeletingEmployee(null);
      fetchEmployees();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete employee.';
      showToast('error', errorMsg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        pendingCount={pendingUsers.length}
        onOpenApprovals={() => setIsApprovalsModalOpen(true)}
      />

      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {/* Metric Cards */}
        <StatsCards employees={employees} />

        {/* Filter Bar */}
        <EmployeeFilter
          search={search}
          setSearch={setSearch}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          departments={departments}
          statuses={statuses}
          onReset={handleResetFilters}
          onAddClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
        />

        {/* Employee Table */}
        {loading ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>Loading employee records from server...</div>
          </div>
        ) : (
          <EmployeeTable
            employees={employees}
            onView={(emp) => { setViewingEmployee(emp); setIsViewModalOpen(true); }}
            onEdit={(emp) => { setEditingEmployee(emp); setIsModalOpen(true); }}
            onDelete={(emp) => { setDeletingEmployee(emp); setIsDeleteModalOpen(true); }}
          />
        )}
      </main>

      {/* Modals */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEmployee(null); }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
        departments={departments}
        statuses={statuses}
      />

      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setViewingEmployee(null); }}
        employee={viewingEmployee}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingEmployee(null); }}
        onConfirm={handleDeleteConfirm}
        employee={deletingEmployee}
      />

      <PendingApprovalsModal
        isOpen={isApprovalsModalOpen}
        onClose={() => setIsApprovalsModalOpen(false)}
        pendingUsers={pendingUsers}
        onApprove={handleApproveUser}
        onDecline={handleDeclineUser}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default DashboardPage;
