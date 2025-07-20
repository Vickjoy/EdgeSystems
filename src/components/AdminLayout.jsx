import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const sidebarStyle = {
  width: 220,
  background: '#222e3c',
  color: '#fff',
  minHeight: '100vh',
  padding: '2rem 1rem',
  position: 'fixed',
  top: 0,
  left: 0,
};

const contentStyle = {
  marginLeft: 220,
  padding: '2rem',
  minHeight: '100vh',
  background: '#f4f6fa',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  display: 'block',
  padding: '0.75rem 0',
  fontWeight: 600,
  borderRadius: 6,
  transition: 'background 0.2s',
  cursor: 'pointer',
};

const activeLinkStyle = {
  background: '#1DCD9F',
  color: '#222e3c',
};

const AdminLayout = ({ children }) => {
  const pathname = window.location.pathname;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex' }}>
      <aside style={sidebarStyle}>
        <h2 style={{ color: '#1DCD9F', marginBottom: 32 }}>Admin Panel</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <a href="/admin-categories" style={{ ...linkStyle, ...(pathname === '/admin-categories' ? activeLinkStyle : {}) }}>Categories</a>
            </li>
            <li>
              <a href="/admin-subcategories" style={{ ...linkStyle, ...(pathname === '/admin-subcategories' ? activeLinkStyle : {}) }}>Subcategories</a>
            </li>
            <li>
              <a href="/admin-products" style={{ ...linkStyle, ...(pathname === '/admin-products' ? activeLinkStyle : {}) }}>Products</a>
            </li>
            <li style={{ marginTop: 32 }}>
              <a href="#" onClick={handleLogout} style={{ ...linkStyle, color: '#1DCD9F' }}>Logout</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={contentStyle}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 