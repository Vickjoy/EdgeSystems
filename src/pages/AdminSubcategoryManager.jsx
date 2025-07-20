import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchCategories, fetchSubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from '../utils/api';

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

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};
const modalFormStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: 10,
  minWidth: 320,
  boxShadow: '0 2px 16px rgba(0,0,0,0.15)'
};
const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  borderRadius: 5,
  border: '1px solid #ccc',
  color: '#111',
  fontSize: '1rem'
};

const AdminSubcategoryManager = () => {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ type: null, value: '', id: null, categoryId: '' });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const cats = await fetchCategories(token);
        setCategories(Array.isArray(cats) ? cats : []);
        // Fetch all subcategories for all categories (previous approach)
        let allSubs = [];
        for (const cat of cats) {
          const subs = await fetchSubcategories(cat.slug, token);
          if (Array.isArray(subs)) {
            allSubs = allSubs.concat(subs.map(sub => ({ ...sub, category: cat }))); // Attach category object
          }
        }
        setSubcategories(allSubs);
      } catch (e) {
        setCategories([]);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  const getCategoryName = (catObjOrId) => {
    if (!catObjOrId) return '';
    if (typeof catObjOrId === 'object' && catObjOrId.name) return catObjOrId.name;
    const cat = categories.find(c => c.id === catObjOrId || c.slug === catObjOrId);
    return cat ? cat.name : '';
  };

  const handleSubcategoryAction = async (action, id, value, categoryId) => {
    setError('');
    setLoading(true);
    try {
      const cat = categories.find(c => c.id === categoryId);
      if (!cat) throw new Error('Category not found');
      if (action === 'add') {
        await createSubcategory(cat.slug, value, token);
      } else if (action === 'edit') {
        await updateSubcategory(cat.slug, id, value, token);
      } else if (action === 'delete') {
        await deleteSubcategory(cat.slug, id, token);
      }
      // Reload all subcategories (previous approach)
      let allSubs = [];
      for (const cat of categories) {
        const subs = await fetchSubcategories(cat.slug, token);
        if (Array.isArray(subs)) {
          allSubs = allSubs.concat(subs.map(sub => ({ ...sub, category: cat })));
        }
      }
      setSubcategories(allSubs);
    } catch (e) {
      setError('Failed to perform subcategory action.');
    } finally {
      setLoading(false);
      setModal({ type: null, value: '', id: null, categoryId: '' });
    }
  };

  if (!user?.is_staff && !user?.is_superuser) {
    return <div style={{ color: 'red', fontWeight: 600 }}>Unauthorized</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#1DCD9F', fontWeight: 700 }}>Subcategory Management</h2>
      <button
        style={{ ...actionBtnStyle, marginBottom: 16 }}
        onClick={() => setModal({ type: 'add-subcategory', value: '', id: null, categoryId: categories[0]?.id || '' })}
        disabled={categories.length === 0}
      >
        + Add Subcategory
      </button>
      {loading ? <div>Loading...</div> : null}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Subcategory Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map(sub => (
            <tr key={sub.id}>
              <td style={tdStyle}>{sub.name}</td>
              <td style={tdStyle}>{getCategoryName(sub.category)}</td>
              <td style={tdStyle}>
                <button style={actionBtnStyle} onClick={() => setModal({ type: 'edit-subcategory', value: sub.name, id: sub.id, categoryId: sub.category })}>Edit</button>
                <button style={deleteBtnStyle} onClick={() => setModal({ type: 'delete-subcategory', value: sub.name, id: sub.id, categoryId: sub.category })}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal for add/edit/delete */}
      {modal.type && (
        <div style={modalOverlayStyle}>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (modal.type === 'add-subcategory') handleSubcategoryAction('add', null, modal.value, modal.categoryId);
              if (modal.type === 'edit-subcategory') handleSubcategoryAction('edit', modal.id, modal.value, modal.categoryId);
              if (modal.type === 'delete-subcategory') handleSubcategoryAction('delete', modal.id, null, modal.categoryId);
            }}
            style={modalFormStyle}
          >
            <h3 style={{ color: '#1DCD9F', fontWeight: 700, marginBottom: 16 }}>
              {modal.type === 'add-subcategory' && 'Add Subcategory'}
              {modal.type === 'edit-subcategory' && 'Edit Subcategory'}
              {modal.type === 'delete-subcategory' && 'Delete Subcategory'}
            </h3>
            {(modal.type === 'add-subcategory' || modal.type === 'edit-subcategory') && (
              <>
                <input
                  type="text"
                  value={modal.value}
                  onChange={e => setModal(m => ({ ...m, value: e.target.value }))}
                  placeholder="Subcategory Name"
                  required
                  style={inputStyle}
                />
                <select
                  value={modal.categoryId}
                  onChange={e => setModal(m => ({ ...m, categoryId: e.target.value }))}
                  style={{ ...inputStyle, marginBottom: 24 }}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </>
            )}
            {modal.type && modal.type.startsWith('delete') && (
              <div style={{ color: '#e74c3c', marginBottom: 16 }}>Are you sure you want to delete "{modal.value}"?</div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={actionBtnStyle}>{modal.type && modal.type.startsWith('delete') ? 'Delete' : 'Save'}</button>
              <button type="button" onClick={() => setModal({ type: null, value: '', id: null, categoryId: '' })} style={deleteBtnStyle}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminSubcategoryManager; 