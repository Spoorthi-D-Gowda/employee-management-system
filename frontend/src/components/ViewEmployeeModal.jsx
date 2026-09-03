import React from 'react';
import { X, Mail, Phone, DollarSign, Calendar, Building2, Briefcase, UserCheck } from 'lucide-react';

const ViewEmployeeModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Employee Profile</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        {/* Profile Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', background: 'var(--bg-secondary)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {employee.firstName} {employee.lastName}
            </h2>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <span className="badge badge-dept">
                {employee.department ? employee.department.replace('_', ' ') : 'N/A'}
              </span>
              <span className={`badge badge-${employee.employmentStatus ? employee.employmentStatus.toLowerCase() : ''}`}>
                {employee.employmentStatus ? employee.employmentStatus.replace('_', ' ') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <Mail size={18} color="var(--accent-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL ADDRESS</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{employee.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <Phone size={18} color="var(--accent-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PHONE NUMBER</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{employee.phoneNumber || 'Not provided'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <DollarSign size={18} color="var(--success)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ANNUAL SALARY</div>
              <div style={{ color: 'var(--success)', fontWeight: 700 }}>{formatCurrency(employee.salary)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <Calendar size={18} color="var(--info)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SYSTEM ENTRY DATE</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatDate(employee.createdAt)}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeModal;
