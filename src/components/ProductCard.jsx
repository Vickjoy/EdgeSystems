import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onDelete }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${product.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        if (onDelete) onDelete(product.id);
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      alert('Error deleting product.');
    }
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <img 
          src={product.image ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`) : '/placeholder.png'} 
          alt={product.name} 
          className={styles.image} 
          onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
        />
        <div className={styles.content}>
          <h3 className={styles.title}>{product.name}</h3>
          <div style={{ marginBottom: 4, color: '#1DCD9F', fontWeight: 600, fontSize: 13 }}>inclusive +30% VAT</div>
          <p className={styles.price} style={{ fontSize: 18, fontWeight: 700 }}>KES {(product.price * 1.3).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              className={styles.button}
              style={{ background: '#1DCD9F', color: 'white', flex: 1 }}
              onClick={e => { e.preventDefault(); navigate(`/checkout?product=${product.id}`); }}
            >
              Buy Now
            </button>
            <button
              className={styles.button}
              style={{ background: '#6096B4', color: 'white', flex: 1 }}
              onClick={e => { e.preventDefault(); navigate(`/product/${product.id}`); }}
            >
              View Product
            </button>
          </div>
        </div>
      </Link>
      {/* Only show Edit/Delete for admins */}
      {(user?.is_staff || user?.is_superuser) && (
        <div style={{ marginTop: 8, display: 'flex', gap: 8, padding: '0 1.5rem 1rem 1.5rem' }}>
          <Link to={`/product/edit/${product.id}`} className={styles.button} style={{ background: '#1DCD9F' }}>
            Edit
          </Link>
          <button onClick={handleDelete} className={styles.button} style={{ background: '#e74c3c' }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;