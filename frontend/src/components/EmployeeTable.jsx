import React from 'react';
import { Eye, Edit3, Trash2, Mail, Phone, DollarSign, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EmployeeTable = ({ employees, onEdit, onDelete, onView }) => {
  const { isAdmin } = useAuth();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'FULL_TIME': return 'badge-full_time';
      case 'PART_TIME': return 'badge-part_time';
      case 'CONTRACT': return 'badge-contract';
      case 'INACTIVE': return 'badge-inactive';
      default: return '';
    }
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  if (!employees || employees.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: 'var(--text-muted)'
        }}>
          <Briefcase size={32} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No employees found</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Try clearing filters or search query to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card table-container" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Status</th>
            <th>Contact</th>
            <th>Salary</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              {/* Employee Info */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} /> {emp.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Department */}
              <td>
                <span className="badge badge-dept">
                  {emp.department ? emp.department.replace('_', ' ') : 'N/A'}
                </span>
              </td>

              {/* Employment Status */}
              <td>
                <span className={`badge ${getStatusBadgeClass(emp.employmentStatus)}`}>
                  {emp.employmentStatus ? emp.employmentStatus.replace('_', ' ') : 'N/A'}
                </span>
              </td>

              {/* Phone Contact */}
              <td>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="var(--text-muted)" /> {emp.phoneNumber || 'Not specified'}
                </div>
              </td>

              {/* Salary */}
              <td>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <DollarSign size={14} color="var(--success)" /> {formatCurrency(emp.salary).replace('$', '')}
                </div>
              </td>

              {/* Actions */}
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                  <button onClick={() => onView(emp)} className="btn-icon" title="View Employee Details">
                    <Eye size={17} color="var(--info)" />
                  </button>

                  {isAdmin && (
                    <>
                      <button onClick={() => onEdit(emp)} className="btn-icon" title="Edit Employee Record">
                        <Edit3 size={17} color="var(--accent-primary)" />
                      </button>

                      <button onClick={() => onDelete(emp)} className="btn-icon" title="Delete Employee Record">
                        <Trash2 size={17} color="var(--danger)" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
