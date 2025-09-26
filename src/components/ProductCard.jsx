import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onDelete }) => {
  console.log('[EdgeSystems ProductCard] product debug:', product.name);
  console.log('Product image:', product.image);

  const { user, token } = useAuth();
  const { addToCart } = useCart();
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

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation to product detail
    addToCart(product);
    
    // Optional: Show a brief success message
    const button = e.target;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.color = '#10b981';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.color = '';
    }, 1500);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className={styles.card}
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`View details for ${product.name}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={product.image ? product.image : '/placeholder.png'}
          alt={product.name}
          className={styles.image}
          onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        
        {/* Add to Cart Link */}
        <button
          className={styles.addToCartLink}
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
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