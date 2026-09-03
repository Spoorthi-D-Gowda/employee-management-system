import React from 'react';
import { Users, Briefcase, Building2, UserCheck } from 'lucide-react';

const StatsCards = ({ employees = [] }) => {
  const total = employees.length;
  const fullTime = employees.filter((e) => e.employmentStatus === 'FULL_TIME').length;
  const engineering = employees.filter((e) => e.department === 'ENGINEERING').length;
  const activeCount = employees.filter((e) => e.employmentStatus !== 'INACTIVE').length;

  const stats = [
    { label: 'Total Employees', value: total, icon: Users, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
    { label: 'Active Personnel', value: activeCount, icon: UserCheck, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    { label: 'Full-Time Staff', value: fullTime, icon: Briefcase, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    { label: 'Engineering Team', value: engineering, icon: Building2, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="glass-card glass-card-hover" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: item.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.color
            }}>
              <Icon size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{item.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
