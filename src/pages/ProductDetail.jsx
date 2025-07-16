import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductDetail.module.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';

const ProductDetail = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(location.pathname.startsWith('/product/edit/'));
  const productId = params.id;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${productId}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching product details:', error));
  }, [productId]);

  const handleEditSubmit = async (form) => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      if (form.image && typeof form.image !== 'string') {
        formData.append('image', form.image);
      }
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to update product');
      navigate(`/product/${productId}`);
    } catch (err) {
      alert('Error updating product.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (editMode) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <ProductForm
          initialValues={product}
          onSubmit={handleEditSubmit}
          onCancel={() => navigate(`/product/${productId}`)}
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs crumbs={[
        { label: 'Home', path: '/' },
        { label: 'Fire Safety', path: '/fire-safety' },
        { label: 'Fire Extinguishers', path: '/fire-safety/extinguishers' },
        { label: product.name, path: `/product/${product.id}` }
      ]} />
      <section className={styles.section}>
        <div className={styles.container}>
          <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', color: '#333', borderRadius: 12, padding: 32, boxShadow: '0 4px 32px rgba(96,150,180,0.08)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ width: '100%', textAlign: 'center' }}>
              <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} style={{ width: '100%', maxWidth: 320, height: 'auto', borderRadius: 8, margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#6096B4', textAlign: 'center' }}>{product.name}</h2>
            <div style={{ color: '#1DCD9F', fontWeight: 600, fontSize: 15, marginBottom: 0, textAlign: 'center' }}>inclusive +30% VAT</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2, color: '#1DCD9F', textAlign: 'center' }}>KES {(product.price * 1.3).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</div>
            <div style={{ margin: '12px 0', fontWeight: 600 }}>Status: <span style={{ color: product.status === 'in_stock' ? '#1DCD9F' : '#e74c3c' }}>{product.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}</span></div>
            <div style={{ marginBottom: 8 }}><b>Description:</b> {product.description}</div>
            <div style={{ marginBottom: 8 }}><b>Features:</b> {product.features}</div>
            <div style={{ marginBottom: 8 }}><b>Specifications:</b> {product.specifications}</div>
            {product.documentation && (
              <div style={{ marginBottom: 8 }}><b>Documentation:</b> <a href={product.documentation} target="_blank" rel="noopener noreferrer">{product.documentation}</a></div>
            )}
            <div style={{ marginBottom: 8 }}><b>Subcategory:</b> {product.subcategory_name || product.subcategory}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <label htmlFor="quantity" style={{ fontWeight: 600 }}>Quantity</label>
              <input type="number" id="quantity" defaultValue="1" min="1" style={{ border: '1px solid #BDCDD6', borderRadius: 4, padding: '0.5rem', width: 80, fontSize: 16 }} />
              <button style={{ background: '#1DCD9F', color: 'white', fontWeight: 700, padding: '0.5rem 1.5rem', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 16 }}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;