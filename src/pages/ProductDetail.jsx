import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ match }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const productId = match.params.id;

  useEffect(() => {
    // Fetch product details from the backend
    fetch(`/api/products/${productId}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching product details:', error));
  }, [productId]);

  if (loading) {
    return <p>Loading...</p>;
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
              <img src={product.image} alt={product.name} className={styles.productImage} />
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