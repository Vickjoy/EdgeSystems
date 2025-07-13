import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductList.module.css';

const ProductList = ({ match }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = match.params.category;

  useEffect(() => {
    // Fetch products from the backend
    fetch(`/api/products?category=${category}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [category]);

  return (
    <div>
      <Breadcrumbs crumbs={[
        { label: 'Home', path: '/' },
        { label: 'Fire Safety', path: '/fire-safety' },
        { label: category.charAt(0).toUpperCase() + category.slice(1), path: `/fire-safety/${category}` }
      ]} />
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Fire Safety Products</h2>
          {/* Category Filter Section */}
          <select className={styles.filter}>
            <option>All Categories</option>
            <option>Fire Alarm & Detection</option>
            <option>Fire Suppression</option>
            <option>Fire Prevention</option>
            <option>Accessories</option>
            <option>Networking</option>
            <option>Cabling</option>
            <option>Communication</option>
          </select>
          {/* Product Grid */}
          <div className={styles.productsGrid}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductList;