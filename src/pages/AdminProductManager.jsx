import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import { fetchSubcategories, createProduct, updateProduct, fetchProductById } from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminProductManager = () => {
  const { token, user } = useAuth();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get ?edit=ID from query
  const params = new URLSearchParams(location.search);
  const editId = params.get('edit');

  useEffect(() => {
    const loadSubcategories = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/subcategories/', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();
        setSubcategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadSubcategories();
  }, [token]);

  useEffect(() => {
    if (editId) {
      const loadProduct = async () => {
        setFormLoading(true);
        try {
          const product = await fetchProductById(editId);
          setEditingProduct(product);
        } catch (e) {
          setError('Failed to load product for editing.');
        } finally {
          setFormLoading(false);
        }
      };
      loadProduct();
    } else {
      setEditingProduct(null);
    }
  }, [editId]);

  const handleAddOrEditProduct = async (form) => {
    setFormLoading(true);
    setError('');
    try {
      if (editingProduct) {
        await updateProduct(editId, form, token);
      } else {
        await createProduct(form, token);
      }
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Failed to save product.');
    } finally {
      setFormLoading(false);
    }
  };

  if (!user?.is_staff && !user?.is_superuser) {
    return <div>Unauthorized</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      {loading || formLoading ? (
        <div>Loading...</div>
      ) : (
        <ProductForm
          initialValues={editingProduct}
          onSubmit={handleAddOrEditProduct}
          onCancel={() => navigate('/admin-dashboard')}
          loading={formLoading}
          subcategories={subcategories}
        />
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default AdminProductManager; 