import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import { fetchCategories, fetchSubcategories, fetchProductsBySubcategory, createProduct, updateProduct, deleteProduct } from '../utils/api';

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
  color: '#111',
  verticalAlign: 'middle'
};
const imgStyle = {
  width: 60,
  height: 60,
  objectFit: 'cover',
  borderRadius: 8,
  background: '#f4f6fa',
  border: '1px solid #eee'
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
  minWidth: 340,
  boxShadow: '0 2px 16px rgba(0,0,0,0.15)'
};

const AdminProductManager = () => {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ type: null, initialValues: null });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const cats = await fetchCategories(token);
        setCategories(Array.isArray(cats) ? cats : []);
        // Fetch all subcategories and products
        let allSubs = [];
        let allProducts = [];
        for (const cat of cats) {
          const subs = await fetchSubcategories(cat.slug, token);
          if (Array.isArray(subs)) {
            allSubs = allSubs.concat(subs.map(sub => ({ ...sub, category: cat })));
            for (const sub of subs) {
              const prodResp = await fetchProductsBySubcategory(sub.id, 1, 100, token);
              const prods = Array.isArray(prodResp.results) ? prodResp.results : (Array.isArray(prodResp) ? prodResp : []);
              allProducts = allProducts.concat(prods.map(prod => ({ ...prod, subcategory: sub, category: cat })));
            }
          }
        }
        setSubcategories(allSubs);
        setProducts(allProducts);
      } catch (e) {
        setCategories([]);
        setSubcategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

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
      // Reload all products
      let allProducts = [];
      for (const sub of subcategories) {
        const prodResp = await fetchProductsBySubcategory(sub.id, 1, 100, token);
        const prods = Array.isArray(prodResp.results) ? prodResp.results : (Array.isArray(prodResp) ? prodResp : []);
        allProducts = allProducts.concat(prods.map(prod => ({ ...prod, subcategory: sub, category: sub.category })));
      }
      setProducts(allProducts);
    } catch (e) {
      setError('Failed to perform product action.');
    } finally {
      setLoading(false);
      setModal({ type: null, initialValues: null });
      setDeletingId(null);
    }
  };

  if (!user?.is_staff && !user?.is_superuser) {
    return <div style={{ color: 'red', fontWeight: 600 }}>Unauthorized</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#1DCD9F', fontWeight: 700 }}>Product Management</h2>
      <button
        style={{ ...actionBtnStyle, marginBottom: 16 }}
        onClick={() => setModal({ type: 'add', initialValues: {} })}
      >
        + Add Product
      </button>
      {loading ? <div>Loading...</div> : null}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Subcategory</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td style={tdStyle}>
                {product.image ? (
                  <img src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} alt={product.name} style={imgStyle} />
                ) : (
                  <span style={{ color: '#888' }}>No image</span>
                )}
              </td>
              <td style={tdStyle}>{product.name}</td>
              <td style={tdStyle}>{product.category?.name || ''}</td>
              <td style={tdStyle}>{product.subcategory?.name || ''}</td>
              <td style={tdStyle}>KES {(product.price * 1.16).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
              <td style={tdStyle}>{product.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}</td>
              <td style={tdStyle}>
                <button style={actionBtnStyle} onClick={() => setModal({ type: 'edit', initialValues: product })}>Edit</button>
                <button
                  style={deleteBtnStyle}
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
      {/* Modal for add/edit */}
      {modal.type && (
        <div style={modalOverlayStyle}>
          <div style={modalFormStyle}>
            <ProductForm
              initialValues={modal.initialValues || {}}
              onSubmit={form => handleProductAction(modal.type, form, modal.initialValues?.id)}
              onCancel={() => setModal({ type: null, initialValues: null })}
              loading={loading}
              subcategories={subcategories}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManager; 