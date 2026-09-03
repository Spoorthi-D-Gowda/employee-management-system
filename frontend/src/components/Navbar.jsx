import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, LogOut, Sun, Moon, Shield, User as UserIcon, Bell } from 'lucide-react';

const Navbar = ({ pendingCount = 0, onOpenApprovals }) => {
  const { user, isAdmin, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '14px 28px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Users size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NexusEmp
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Enterprise Employee Management
            </span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Pending Approval Notification Button - ADMIN Only */}
          {isAdmin && (
            <button
              onClick={onOpenApprovals}
              className="btn btn-secondary"
              style={{ position: 'relative', padding: '8px 14px', fontSize: '0.85rem' }}
              title="View Pending Access Requests"
            >
              <Bell size={16} color="#a855f7" />
              <span>Approvals</span>
              {pendingCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--danger)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                }}>
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="btn-icon" 
            title="Toggle Light/Dark Theme"
            style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isAdmin ? 'rgba(168, 85, 247, 0.3)' : 'rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isAdmin ? '#c084fc' : '#60a5fa',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  {user.username}
                </span>
                <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`} style={{ fontSize: '0.65rem', padding: '1px 6px', marginTop: '2px' }}>
                  {isAdmin ? <><Shield size={10} /> ADMIN</> : <><UserIcon size={10} /> USER</>}
                </span>
              </div>
            </div>
          )}

          <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
