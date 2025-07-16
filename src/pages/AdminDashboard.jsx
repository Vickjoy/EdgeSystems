import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  fetchCategories, fetchSubcategories, createCategory, updateCategory, deleteCategory,
  createSubcategory, updateSubcategory, deleteSubcategory,
  fetchProductsBySubcategory, createProduct, updateProduct, deleteProduct
} from '../utils/api';
import ProductForm from '../components/ProductForm';
import CompanyLogo from '../assets/Company_logo.webp';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Category State
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModal, setCategoryModal] = useState({ type: null, value: '', id: null });

  // Subcategory State
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategoryModal, setSubcategoryModal] = useState({ type: null, value: '', id: null });

  // Product State
  const [products, setProducts] = useState([]);
  const [productModal, setProductModal] = useState({ type: null, initialValues: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Load categories on mount
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

  // Load subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      setSelectedSubcategory(null);
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

  // Load products when subcategory changes
  useEffect(() => {
    if (!selectedSubcategory) {
      setProducts([]);
      return;
    }
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProductsBySubcategory(selectedSubcategory.id, 1, 100, token);
        setProducts(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedSubcategory, token]);

  // Category CRUD
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
      setCategoryModal({ type: null, value: '', id: null });
    }
  };

  // Subcategory CRUD
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
      setSubcategoryModal({ type: null, value: '', id: null });
    }
  };

  // Product CRUD
  const handleProductAction = async (action, form, id) => {
    setError('');
    setLoading(true);
    try {
      if (action === 'add') {
        await createProduct(form, token);
      } else if (action === 'edit') {
        await updateProduct(id, form, token);
      } else if (action === 'delete') {
        await deleteProduct(id, token);
      }
      if (selectedSubcategory) {
        const data = await fetchProductsBySubcategory(selectedSubcategory.id, 1, 100, token);
        setProducts(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
      }
    } catch (e) {
      setError('Failed to perform product action.');
    } finally {
      setLoading(false);
      setProductModal({ type: null, initialValues: null });
      setDeletingId(null);
    }
  };

  if (!user?.is_staff && !user?.is_superuser) {
    return <div style={{ textAlign: 'center', marginTop: 48, fontWeight: 700, color: '#e74c3c' }}>Unauthorized</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 32px rgba(96,150,180,0.08)', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <img src={CompanyLogo} alt="Company Logo" style={{ width: 56, height: 56, borderRadius: '50%' }} />
        <h2 style={{ color: '#6096B4', fontWeight: 900, fontSize: 32, margin: 0 }}>Admin Dashboard</h2>
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Sidebar: Categories & Subcategories */}
        <aside style={{ minWidth: 260, borderRight: '1px solid #eee', paddingRight: 32 }}>
          <h3 style={{ color: '#1DCD9F', marginBottom: 16 }}>Categories</h3>
          <button style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 700, cursor: 'pointer', marginBottom: 16 }} onClick={() => setCategoryModal({ type: 'add-category', value: '', id: null })}>+ Add Category</button>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {categories.map(cat => (
              <li key={cat.id} style={{ marginBottom: 10, background: selectedCategory?.id === cat.id ? '#eaf6fa' : 'transparent', borderRadius: 4, padding: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, color: selectedCategory?.id === cat.id ? '#1DCD9F' : '#6096B4', cursor: 'pointer' }} onClick={() => { setSelectedCategory(cat); setSelectedSubcategory(null); }}>{cat.name}</span>
                <button style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setCategoryModal({ type: 'edit-category', value: cat.name, id: cat.id })}>Edit</button>
                <button style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setCategoryModal({ type: 'delete-category', value: cat.name, id: cat.id })}>Delete</button>
              </li>
            ))}
          </ul>
          {selectedCategory && (
            <div style={{ marginTop: 32 }}>
              <h4 style={{ color: '#1DCD9F', marginBottom: 8 }}>Subcategories</h4>
              <button style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer', marginBottom: 8 }} onClick={() => setSubcategoryModal({ type: 'add-subcategory', value: '', id: null })}>+ Add Subcategory</button>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {subcategories.map(sub => (
                  <li key={sub.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: selectedSubcategory?.id === sub.id ? '#1DCD9F' : '#6096B4', fontWeight: 600, cursor: 'pointer' }} onClick={() => setSelectedSubcategory(sub)}>{sub.name}</span>
                    <button style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setSubcategoryModal({ type: 'edit-subcategory', value: sub.name, id: sub.id })}>Edit</button>
                    <button style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setSubcategoryModal({ type: 'delete-subcategory', value: sub.name, id: sub.id })}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
        {/* Main Content: Products */}
        <main style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h3 style={{ color: '#6096B4', fontWeight: 800, fontSize: 24, margin: 0 }}>Products</h3>
            {selectedSubcategory && (
              <button style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setProductModal({ type: 'add', initialValues: { subcategory: selectedSubcategory.id } })}>+ Add Product</button>
            )}
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
          ) : selectedSubcategory ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f4f8fb', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#eaf6fa' }}>
                  <th style={{ padding: 8, borderBottom: '1px solid #e0e6ed' }}>Image</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #e0e6ed' }}>Name</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #e0e6ed' }}>Price</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #e0e6ed' }}>Status</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #e0e6ed' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      {product.image ? (
                        <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                      ) : (
                        <span style={{ color: '#ccc' }}>No image</span>
                      )}
                    </td>
                    <td style={{ padding: 8 }}>{product.name}</td>
                    <td style={{ padding: 8 }}>KES {(product.price * 1.3).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: 8 }}>{product.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}</td>
                    <td style={{ padding: 8 }}>
                      <button
                        style={{ marginRight: 8, background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => setProductModal({ type: 'edit', initialValues: product })}
                      >
                        Edit
                      </button>
                      <button
                        style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 1rem', fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => { if (window.confirm('Are you sure you want to delete this product?')) { setDeletingId(product.id); handleProductAction('delete', null, product.id); } }}
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ color: '#6096B4', fontWeight: 600, fontSize: 18, marginTop: 32 }}>Select a subcategory to view products.</div>
          )}
        </main>
      </div>
      {/* Category Modal */}
      {categoryModal.type && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (categoryModal.type === 'add-category') handleCategoryAction('add', null, categoryModal.value);
              if (categoryModal.type === 'edit-category') handleCategoryAction('edit', categoryModal.id, categoryModal.value);
              if (categoryModal.type === 'delete-category') handleCategoryAction('delete', categoryModal.id);
            }}
            style={{ background: 'white', padding: 32, borderRadius: 8, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
          >
            <h3 style={{ color: '#6096B4', marginBottom: 16 }}>
              {categoryModal.type === 'add-category' && 'Add Category'}
              {categoryModal.type === 'edit-category' && 'Edit Category'}
              {categoryModal.type === 'delete-category' && 'Delete Category'}
            </h3>
            {(categoryModal.type === 'add-category' || categoryModal.type === 'edit-category') && (
              <input
                type="text"
                value={categoryModal.value}
                onChange={e => setCategoryModal(m => ({ ...m, value: e.target.value }))}
                placeholder="Name"
                required
                style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 4, border: '1px solid #ccc' }}
              />
            )}
            {categoryModal.type && categoryModal.type.startsWith('delete') && (
              <div style={{ marginBottom: 16 }}>Are you sure you want to delete "{categoryModal.value}"?</div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 700 }}>{categoryModal.type && categoryModal.type.startsWith('delete') ? 'Delete' : 'Save'}</button>
              <button type="button" onClick={() => setCategoryModal({ type: null, value: '', id: null })} style={{ background: '#ccc', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 700 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Subcategory Modal */}
      {subcategoryModal.type && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (subcategoryModal.type === 'add-subcategory') handleSubcategoryAction('add', null, subcategoryModal.value);
              if (subcategoryModal.type === 'edit-subcategory') handleSubcategoryAction('edit', subcategoryModal.id, subcategoryModal.value);
              if (subcategoryModal.type === 'delete-subcategory') handleSubcategoryAction('delete', subcategoryModal.id);
            }}
            style={{ background: 'white', padding: 32, borderRadius: 8, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
          >
            <h3 style={{ color: '#6096B4', marginBottom: 16 }}>
              {subcategoryModal.type === 'add-subcategory' && 'Add Subcategory'}
              {subcategoryModal.type === 'edit-subcategory' && 'Edit Subcategory'}
              {subcategoryModal.type === 'delete-subcategory' && 'Delete Subcategory'}
            </h3>
            {(subcategoryModal.type === 'add-subcategory' || subcategoryModal.type === 'edit-subcategory') && (
              <input
                type="text"
                value={subcategoryModal.value}
                onChange={e => setSubcategoryModal(m => ({ ...m, value: e.target.value }))}
                placeholder="Name"
                required
                style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 4, border: '1px solid #ccc' }}
              />
            )}
            {subcategoryModal.type && subcategoryModal.type.startsWith('delete') && (
              <div style={{ marginBottom: 16 }}>Are you sure you want to delete "{subcategoryModal.value}"?</div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ background: '#1DCD9F', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 700 }}>{subcategoryModal.type && subcategoryModal.type.startsWith('delete') ? 'Delete' : 'Save'}</button>
              <button type="button" onClick={() => setSubcategoryModal({ type: null, value: '', id: null })} style={{ background: '#ccc', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 700 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Product Modal */}
      {productModal.type && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 8, minWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <ProductForm
              initialValues={productModal.initialValues}
              onSubmit={form => handleProductAction(productModal.type, form, productModal.initialValues?.id)}
              onCancel={() => setProductModal({ type: null, initialValues: null })}
              loading={loading}
              subcategories={subcategories}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 