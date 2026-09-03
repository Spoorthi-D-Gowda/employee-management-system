import React from 'react';
import { Search, Filter, Plus, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EmployeeFilter = ({
  search,
  setSearch,
  selectedDept,
  setSelectedDept,
  selectedStatus,
  setSelectedStatus,
  departments,
  statuses,
  onReset,
  onAddClick,
}) => {
  const { isAdmin } = useAuth();

  return (
    <div className="glass-card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search & Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1, minWidth: '280px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search employee by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div style={{ position: 'relative', width: '180px' }}>
            <select
              className="form-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ position: 'relative', width: '180px' }}>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(search || selectedDept || selectedStatus) && (
            <button onClick={onReset} className="btn btn-secondary" title="Reset all filters">
              <RotateCcw size={16} /> Clear
            </button>
          )}
        </div>

        {/* Action Button - ADMIN Only */}
        {isAdmin && (
          <button onClick={onAddClick} className="btn btn-primary">
            <Plus size={18} /> Add Employee
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeFilter;
