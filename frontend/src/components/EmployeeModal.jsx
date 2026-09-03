import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const EmployeeModal = ({ isOpen, onClose, onSave, initialData, departments = [], statuses = [] }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'ENGINEERING',
    employmentStatus: 'FULL_TIME',
    phoneNumber: '',
    salary: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        department: initialData.department || 'ENGINEERING',
        employmentStatus: initialData.employmentStatus || 'FULL_TIME',
        phoneNumber: initialData.phoneNumber || '',
        salary: initialData.salary !== undefined && initialData.salary !== null ? initialData.salary : '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: departments[0] || 'ENGINEERING',
        employmentStatus: statuses[0] || 'FULL_TIME',
        phoneNumber: '',
        salary: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, departments, statuses]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.employmentStatus) newErrors.employmentStatus = 'Status is required';
    if (formData.salary && (isNaN(formData.salary) || Number(formData.salary) < 0)) {
      newErrors.salary = 'Salary must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : 0.0,
      };
      await onSave(payload);
    } catch (err) {
      if (err.response?.data?.details) {
        const backendErrs = {};
        err.response.data.details.forEach((item) => {
          const [field, msg] = item.split(': ');
          if (field) backendErrs[field] = msg || item;
        });
        setErrors(backendErrs);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {initialData ? 'Edit Employee Record' : 'Add New Employee'}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Sarah"
              />
              {errors.firstName && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/>{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Jenkins"
              />
              {errors.lastName && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/>{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sarah.jenkins@company.com"
            />
            {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/>{errors.email}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="form-select"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {errors.department && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.department}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Employment Status *</label>
              <select
                className="form-select"
                value={formData.employmentStatus}
                onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {errors.employmentStatus && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.employmentStatus}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+1-555-0199"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary (USD)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="85000"
              />
              {errors.salary && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.salary}</span>}
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={16} /> {submitting ? 'Saving...' : initialData ? 'Update Record' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
