import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchCategories, fetchSubcategories, fetchProductsForSubcategory } from '../utils/api';
import styles from './ProductList.module.css';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  // Fetch category by slug
  useEffect(() => {
    const getCategory = async () => {
      const cats = await fetchCategories();
      const found = cats.find(cat => cat.slug === slug);
      setCategory(found || null);
    };
    getCategory();
  }, [slug]);

  // Fetch subcategories for this category
  useEffect(() => {
    if (!category) return;
    const getSubs = async () => {
      const subs = await fetchSubcategories(category.slug);
      setSubcategories(subs);
      setSelectedSubcategory(subs[0] || null);
    };
    getSubs();
    const handleSubcategoriesUpdated = () => getSubs();
    window.addEventListener('subcategoriesUpdated', handleSubcategoriesUpdated);
    return () => window.removeEventListener('subcategoriesUpdated', handleSubcategoriesUpdated);
  }, [category]);

  // Fetch products for selected subcategory
  const fetchProducts = useCallback(async () => {
    if (!selectedSubcategory) return;
    setLoading(true);
    try {
      const data = await fetchProductsForSubcategory(selectedSubcategory.slug);
      setProducts(Array.isArray(data) ? data : []);
      setHasMore(false); // No pagination for now
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSubcategory]);

  // Reset products and page when subcategory changes
  useEffect(() => {
    fetchProducts();
    const handleProductsUpdated = () => fetchProducts();
    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdated);
  }, [selectedSubcategory, fetchProducts]);

  // Infinite scroll observer
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

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
            {products.length > 0 ? (
              <div className={styles.productsGrid}>
                {products.map((product, idx) => {
                  if (products.length === idx + 1) {
                    return (
                      <div ref={lastProductRef} key={product.id}>
                        <ProductCard product={product} />
                      </div>
                    );
                  } else {
                    return <ProductCard key={product.id} product={product} />;
                  }
                })}
                {loading && <p>Loading...</p>}
                {!hasMore && !loading && products.length > 0 && <p style={{ color: 'white', textAlign: 'center', marginTop: 16 }}>No more products.</p>}
              </div>
            ) : (
              !loading && <p style={{ color: 'white', textAlign: 'center', marginTop: 32, fontSize: 18 }}>No products in this subcategory yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage; 