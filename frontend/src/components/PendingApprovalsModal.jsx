import React, { useState } from 'react';
import { X, Check, UserX, UserCheck, Mail, Calendar, Clock } from 'lucide-react';

const PendingApprovalsModal = ({ isOpen, onClose, pendingUsers = [], onApprove, onDecline }) => {
  const [processingId, setProcessingId] = useState(null);

  if (!isOpen) return null;

  const handleApprove = async (user) => {
    setProcessingId(user.id);
    try {
      await onApprove(user);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (user) => {
    setProcessingId(user.id);
    try {
      await onDecline(user);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={24} color="#a855f7" /> Pending User Access Requests
          </h2>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        {/* Content Body */}
        {pendingUsers.length === 0 ? (
          <div style={{ padding: '36px 16px', textAlign: 'center' }}>
            <Clock size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Pending Access Requests</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              All user registration requests have been reviewed and processed.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
            {pendingUsers.map((u) => (
              <div
                key={u.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(168, 85, 247, 0.2)',
                    color: '#c084fc',
                    fontWeight: 700,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(168, 85, 247, 0.3)'
                  }}>
                    {u.username.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {u.username}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Mail size={12} /> {u.email}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Calendar size={12} /> Requested: {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Actions: Approve / Decline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleDecline(u)}
                    disabled={processingId === u.id}
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    title="Decline Account Access"
                  >
                    <UserX size={14} /> Decline
                  </button>

                  <button
                    onClick={() => handleApprove(u)}
                    disabled={processingId === u.id}
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#10b981' }}
                    title="Approve Account Access"
                  >
                    <Check size={14} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={onClose} className="btn btn-secondary">Done</button>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalsModal;
