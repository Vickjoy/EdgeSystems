import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../utils/api';
import styles from './AdminPanel.module.css';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  color: '#111',
  fontSize: '1rem',
  marginTop: '2rem',
  boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
};
const thStyle = {
  background: '#f4f6fa',
  color: '#111',
  fontWeight: 700,
  padding: '0.75rem 1rem',
  borderBottom: '2px solid #1DCD9F',
  textAlign: 'left'
};
const tdStyle = {
  padding: '0.75rem 1rem',
  borderBottom: '1px solid #eee',
  color: '#111'
};
const actionBtnStyle = {
  marginRight: 8,
  padding: '0.4rem 1rem',
  borderRadius: 5,
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  background: '#1DCD9F',
  color: '#fff',
  transition: 'background 0.2s',
};
const deleteBtnStyle = {
  ...actionBtnStyle,
  background: '#e74c3c',
};

const AdminCategoryManager = () => {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ type: null, value: '', id: null });

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories(token);
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [token]);

  const handleCategoryAction = async (action, id, value) => {
    setError('');
    setLoading(true);
    try {
      if (action === 'add') {
        await createCategory(value, token);
      } else if (action === 'edit') {
        await updateCategory(id, value, token);
      } else if (action === 'delete') {
        await deleteCategory(id, token);
      }
      const data = await fetchCategories(token);
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to perform category action.');
    } finally {
      setLoading(false);
      setModal({ type: null, value: '', id: null });
    }
  };

  if (!user?.is_staff && !user?.is_superuser) {
    return <div style={{ color: 'red', fontWeight: 600 }}>Unauthorized</div>;
  }

  return (
    <div className={styles.adminPanel}>
      <h2 className={styles.sectionTitle}>Category Management</h2>
      <button
        style={{ ...actionBtnStyle, marginBottom: 16 }}
        onClick={() => setModal({ type: 'add-category', value: '', id: null })}
      >
        + Add Category
      </button>
      {loading ? <div className={styles.loading}>Loading...</div> : null}
      {error && <div className={styles.error}>{error}</div>}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Category Name</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td style={tdStyle}>{cat.name}</td>
              <td style={tdStyle}>
                <button style={actionBtnStyle} onClick={() => setModal({ type: 'edit-category', value: cat.name, id: cat.id })}>Edit</button>
                <button style={deleteBtnStyle} onClick={() => setModal({ type: 'delete-category', value: cat.name, id: cat.id })}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal for add/edit/delete */}
      {modal.type && (
        <div className={styles.modalOverlay}>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (modal.type === 'add-category') handleCategoryAction('add', null, modal.value);
              if (modal.type === 'edit-category') handleCategoryAction('edit', modal.id, modal.value);
              if (modal.type === 'delete-category') handleCategoryAction('delete', modal.id);
            }}
            className={styles.modalForm}
          >
            <h3 className={styles.modalTitle}>
              {modal.type === 'add-category' && 'Add Category'}
              {modal.type === 'edit-category' && 'Edit Category'}
              {modal.type === 'delete-category' && 'Delete Category'}
            </h3>
            {(modal.type === 'add-category' || modal.type === 'edit-category') && (
              <input
                type="text"
                value={modal.value}
                onChange={e => setModal(m => ({ ...m, value: e.target.value }))}
                placeholder="Name"
                required
                className={styles.input}
                style={{ color: '#111' }}
              />
            )}
            {modal.type && modal.type.startsWith('delete') && (
              <div className={styles.deleteConfirm}>Are you sure you want to delete "{modal.value}"?</div>
            )}
            <div className={styles.modalActions}>
              <button type="submit" style={actionBtnStyle}>{modal.type && modal.type.startsWith('delete') ? 'Delete' : 'Save'}</button>
              <button type="button" onClick={() => setModal({ type: null, value: '', id: null })} style={deleteBtnStyle}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryManager; 