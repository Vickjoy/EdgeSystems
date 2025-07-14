import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onDelete }) => {
  const { user, token } = useAuth();

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
      <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>${product.price}</p>
        <Link to={`/product/${product.id}`} className={styles.button}>
          View Details
        </Link>
        {user?.is_staff || user?.is_admin ? (
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <Link to={`/product/edit/${product.id}`} className={styles.button} style={{ background: '#1DCD9F' }}>
              Edit
            </Link>
            <button onClick={handleDelete} className={styles.button} style={{ background: '#e74c3c' }}>
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;