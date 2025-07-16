import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, fetchSubcategories, createCategory, updateCategory, deleteCategory, createSubcategory, updateSubcategory, deleteSubcategory } from '../utils/api';

const AdminCategoryManager = () => {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ type: null, value: '', id: null });
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    const loadSubcategories = async () => {
      setLoading(true);
      try {
        const data = await fetchSubcategories(selectedCategory.id, token);
        setSubcategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadSubcategories();
  }, [selectedCategory, token]);

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
        setSelectedCategory(null);
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

  const handleSubcategoryAction = async (action, id, value) => {
    setError('');
    setLoading(true);
    try {
      if (action === 'add') {
        await createSubcategory(selectedCategory.id, value, token);
      } else if (action === 'edit') {
        await updateSubcategory(selectedCategory.id, id, value, token);
      } else if (action === 'delete') {
        await deleteSubcategory(id, token);
      }
      const data = await fetchSubcategories(selectedCategory.id, token);
      setSubcategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to perform subcategory action.');
    } finally {
      setLoading(false);
      setModal({ type: null, value: '', id: null });
    }
  };

  if (!user?.is_staff && !user?.is_superuser) {
    return <div>Unauthorized</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>Category & Subcategory Management</h2>
      <button
        style={{ marginBottom: 16, background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 700, cursor: 'pointer' }}
        onClick={() => setModal({ type: 'add-category', value: '', id: null })}
      >
        + Add Category
      </button>
      {loading ? <div>Loading...</div> : null}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map(cat => (
          <li key={cat.id} style={{ marginBottom: 16, background: '#f4f8fb', borderRadius: 6, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, color: selectedCategory?.id === cat.id ? '#1DCD9F' : '#6096B4', cursor: 'pointer' }} onClick={() => setSelectedCategory(cat)}>{cat.name}</span>
              <button style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setModal({ type: 'edit-category', value: cat.name, id: cat.id })}>Edit</button>
              <button style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setModal({ type: 'delete-category', value: cat.name, id: cat.id })}>Delete</button>
            </div>
            {selectedCategory?.id === cat.id && (
              <div style={{ marginTop: 12, marginLeft: 24 }}>
                <h4>Subcategories</h4>
                <button style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer', marginBottom: 8 }} onClick={() => setModal({ type: 'add-subcategory', value: '', id: null })}>+ Add Subcategory</button>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {subcategories.map(sub => (
                    <li key={sub.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{sub.name}</span>
                      <button style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setModal({ type: 'edit-subcategory', value: sub.name, id: sub.id })}>Edit</button>
                      <button style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setModal({ type: 'delete-subcategory', value: sub.name, id: sub.id })}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Modal for add/edit/delete */}
      {modal.type && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (modal.type === 'add-category') handleCategoryAction('add', null, modal.value);
              if (modal.type === 'edit-category') handleCategoryAction('edit', modal.id, modal.value);
              if (modal.type === 'delete-category') handleCategoryAction('delete', modal.id);
              if (modal.type === 'add-subcategory') handleSubcategoryAction('add', null, modal.value);
              if (modal.type === 'edit-subcategory') handleSubcategoryAction('edit', modal.id, modal.value);
              if (modal.type === 'delete-subcategory') handleSubcategoryAction('delete', modal.id);
            }}
            style={{ background: 'white', padding: 32, borderRadius: 8, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
          >
            <h3 style={{ color: '#6096B4', marginBottom: 16 }}>
              {modal.type === 'add-category' && 'Add Category'}
              {modal.type === 'edit-category' && 'Edit Category'}
              {modal.type === 'delete-category' && 'Delete Category'}
              {modal.type === 'add-subcategory' && 'Add Subcategory'}
              {modal.type === 'edit-subcategory' && 'Edit Subcategory'}
              {modal.type === 'delete-subcategory' && 'Delete Subcategory'}
            </h3>
            {(modal.type === 'add-category' || modal.type === 'edit-category' || modal.type === 'add-subcategory' || modal.type === 'edit-subcategory') && (
              <input
                type="text"
                value={modal.value}
                onChange={e => setModal(m => ({ ...m, value: e.target.value }))}
                placeholder="Name"
                required
                style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 4, border: '1px solid #ccc' }}
              />
            )}
            {modal.type && modal.type.startsWith('delete') && (
              <div style={{ marginBottom: 16 }}>Are you sure you want to delete "{modal.value}"?</div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 700 }}>{modal.type && modal.type.startsWith('delete') ? 'Delete' : 'Save'}</button>
              <button type="button" onClick={() => setModal({ type: null, value: '', id: null })} style={{ background: '#ccc', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 700 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryManager; 