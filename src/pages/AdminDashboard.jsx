import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || (!user.is_staff && !user.is_superuser)) {
    return <div style={{ padding: 32, textAlign: 'center' }}><h2>Access Denied</h2><p>You do not have permission to view this page.</p></div>;
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.username}!</p>
      <div style={{ margin: '2rem 0' }}>
        <button onClick={() => navigate('/fire-safety/alarm-detection')} style={{ marginRight: 16, padding: '0.5rem 1.5rem', background: '#1DCD9F', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>Manage Fire Safety Products</button>
        <button onClick={() => navigate('/ict/networking')} style={{ padding: '0.5rem 1.5rem', background: '#1DCD9F', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>Manage ICT Products</button>
      </div>
      <button onClick={logout} style={{ background: '#e74c3c', color: '#fff', padding: '0.5rem 1.5rem', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>Logout</button>
    </div>
  );
};

export default AdminDashboard; 