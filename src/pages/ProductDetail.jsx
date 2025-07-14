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
      formData.append('category', form.category);
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
          <div className={styles.productLayout}>
            <div className={styles.imageContainer}>
              <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} className={styles.productImage} />
            </div>
            <div className={styles.detailsContainer}>
              <h2 className={styles.productTitle}>{product.name}</h2>
              <p className="mb-4">{product.description}</p>
              <p className={styles.productPrice}>${product.price}</p>
              <p className="mb-4">{product.availability}</p>
              <div className={styles.formGroup}>
                <label htmlFor="quantity" className={styles.label}>Quantity</label>
                <input type="number" id="quantity" defaultValue="1" min="1" className={styles.quantityInput} />
              </div>
              <button className={styles.addToCartButton}>
                Add to Cart
              </button>
              {/* Optional Tabs Section */}
              <div className={styles.tabs}>
                <div className={styles.tabsContainer}>
                  <button className={styles.tabButton}>Documentation</button>
                  <button className={styles.tabButton}>Specs / Features</button>
                  <button className={styles.tabButton}>Related Products</button>
                </div>
                <div className="pt-4">
                  {/* Content for selected tab */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;