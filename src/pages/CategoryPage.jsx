import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchCategories, fetchSubcategories, fetchProductsForSubcategory } from '../utils/api';
import styles from './ProductList.module.css';

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
      } catch {
        setCategory(null);
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
        setSubcategories(subs);
        setSelectedSubcategory(subs[0] || null);
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
              <p style={{ color: 'white', textAlign: 'center', marginTop: 32, fontSize: 18 }}>Loading...</p>
            ) : products.length > 0 ? (
              <div className={styles.productsGrid}>
                {products.map(product => (
                  <div key={product.id} style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 32px rgba(96,150,180,0.08)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <img
                      src={product.image ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`) : '/placeholder.png'}
                      alt={product.name}
                      style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 8, background: '#f4f4f4' }}
                      onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                    />
                    <h3 style={{ fontWeight: 700, fontSize: 18, color: '#6096B4', margin: 0 }}>{product.name}</h3>
                    <div style={{ color: '#1DCD9F', fontWeight: 600, fontSize: 13, marginBottom: 0 }}>inclusive +16% VAT</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#1DCD9F', marginBottom: 8 }}>
                      KES {(product.price * 1.16).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                      <button
                        style={{ flex: 1, background: '#1DCD9F', color: 'white', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: 4, border: 'none', cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        View Product
                      </button>
                      <button
                        style={{ flex: 1, background: '#93BFCF', color: 'white', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: 4, border: 'none', cursor: 'pointer' }}
                        onClick={() => navigate(`/checkout?product=${product.id}`)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'white', textAlign: 'center', marginTop: 32, fontSize: 18 }}>No products in this subcategory yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage; 