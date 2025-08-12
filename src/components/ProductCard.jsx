import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onDelete }) => {
  // DEBUG: Log the product name and price to confirm this file is used and what price is passed
  console.log('[EdgeSystems ProductCard] price debug:', product.name, product.price);
  console.log('Product image:', product.image); // Debug

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
    <div
      className={styles.card}
      tabIndex={0}
      onClick={() => navigate(`/product/${product.slug}`)}
      role="button"
      aria-label={`View details for ${product.name}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={product.image ? product.image : '/placeholder.png'}
          alt={product.name}
          className={styles.image}
          style={{ width: 100, height: 100, objectFit: 'cover', display: 'block', margin: '0 auto', borderRadius: 12, background: '#f4f4f4' }}
          onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <div className={styles.vatText}>incl +16% VAT</div>
        <div className={styles.price}>KES {Number(product.price).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</div>
        <div className={styles.actions} onClick={e => e.stopPropagation()}>
          {/* Removed View Product button */}
        </div>
      </div>
      {(user?.is_staff || user?.is_superuser) && false && (
        <div style={{ marginTop: 8, display: 'flex', gap: 8, padding: '0 1.5rem 1rem 1.5rem' }}>
          <Link to={`/product/edit/${product.slug}`} className={styles.button} style={{ background: '#1DCD9F' }} onClick={e => e.stopPropagation()}>
            Edit
          </Link>
          <button onClick={e => { e.stopPropagation(); handleDelete(); }} className={styles.button} style={{ background: '#e74c3c' }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
