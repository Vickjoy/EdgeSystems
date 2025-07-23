import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchCategories, fetchSubcategories, fetchProductsForSubcategory } from '../utils/api';
import styles from './ProductList.module.css';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch category by slug
  useEffect(() => {
    const getCategory = async () => {
      try {
        const cats = await fetchCategories();
        const found = cats.find(cat => cat.slug === slug);
        setCategory(found || null);
        setSubcategories([]); // Clear subcategories when category changes
        setSelectedSubcategory(null); // Clear selected subcategory
      } catch {
        setCategory(null);
        setSubcategories([]);
        setSelectedSubcategory(null);
      }
    };
    getCategory();
  }, [slug]);

  // Fetch subcategories for this category
  useEffect(() => {
    if (!category) return;
    const getSubs = async () => {
      try {
        const subs = await fetchSubcategories(category.slug);
        // Safety net: filter subcategories by category id or slug if present
        const filtered = subs.filter(sub => sub.category === category.id || sub.category === category.slug || !sub.category || sub.category === category);
        setSubcategories(filtered);
        setSelectedSubcategory(filtered[0] || null);
      } catch {
        setSubcategories([]);
        setSelectedSubcategory(null);
      }
    };
    getSubs();
    const handleSubcategoriesUpdated = () => getSubs();
    window.addEventListener('subcategoriesUpdated', handleSubcategoriesUpdated);
    return () => window.removeEventListener('subcategoriesUpdated', handleSubcategoriesUpdated);
  }, [category]);

  // Fetch products for selected subcategory
  useEffect(() => {
    if (!selectedSubcategory) return;
    setLoading(true);
    setError('');
    fetchProductsForSubcategory(selectedSubcategory.slug)
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => {
        setProducts([]);
        setError('Could not load products for this subcategory.');
      })
      .finally(() => setLoading(false));
  }, [selectedSubcategory]);

  // Breadcrumbs
  const crumbs = [
    { label: 'Home', path: '/' },
    { label: category ? category.name : slug, path: `/category/${slug}` },
    ...(selectedSubcategory ? [{ label: selectedSubcategory.name, path: '#' }] : [])
  ];

  return (
    <div>
      <Breadcrumbs crumbs={crumbs} />
      <section className={styles.section}>
        <div className={styles.container} style={{ display: 'flex', gap: '2rem' }}>
          {/* Sidebar with subcategories */}
          <aside style={{ minWidth: 220 }}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Subcategories</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {subcategories.length === 0 && <li style={{ color: 'white' }}>No subcategories</li>}
              {subcategories.map(sub => (
                <li key={sub.id}>
                  <button
                    style={{
                      background: selectedSubcategory?.id === sub.id ? '#1DCD9F' : 'white',
                      color: selectedSubcategory?.id === sub.id ? 'white' : '#6096B4',
                      border: 'none',
                      borderRadius: 4,
                      padding: '0.5rem 1rem',
                      marginBottom: 8,
                      width: '100%',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                    onClick={() => setSelectedSubcategory(sub)}
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          {/* Main content: Product Grid */}
          <div style={{ flex: 1 }}>
            <h2 className={styles.title}>{category ? category.name : slug} Products</h2>
            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>{error}</div>}
            {loading ? (
              <p style={{ color: '#222', textAlign: 'center', marginTop: 32, fontSize: 18 }}>Loading...</p>
            ) : products.length > 0 ? (
              <div className={styles.productsGrid}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p style={{ color: '#222', textAlign: 'center', marginTop: 32, fontSize: 18 }}>No products in this subcategory yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage; 