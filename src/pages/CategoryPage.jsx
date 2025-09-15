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
        const items = (data && data.results) ? data.results : (Array.isArray(data) ? data : []);
        setProducts(items);
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
        <div className={styles.categoryContainer}>
          {/* Sticky Sidebar with subcategories */}
          <aside className={styles.stickySidebar}>
            <div className={styles.sidebarContent}>
              <h3 className={styles.sidebarTitle}>Subcategories</h3>
              <div className={styles.subcategoryList}>
                {subcategories.length === 0 && (
                  <div className={styles.noSubcategories}>No subcategories available</div>
                )}
                {subcategories.map(sub => (
                  <button
                    key={sub.id}
                    className={`${styles.subcategoryButton} ${selectedSubcategory?.id === sub.id ? styles.active : ''}`}
                    onClick={() => setSelectedSubcategory(sub)}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content: Product Grid */}
          <div className={styles.mainContent}>
            <h2 className={styles.categoryTitle}>
              {category ? category.name : slug} Products
            </h2>

            {selectedSubcategory && (
              <p className={styles.subcategoryInfo}>
                Showing products in: <strong>{selectedSubcategory.name}</strong>
              </p>
            )}

            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}

            {loading ? (
              <div className={styles.loadingMessage}>Loading products...</div>
            ) : products.length > 0 ? (
              <div className={styles.productsGrid}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.noProductsMessage}>
                No products available in this subcategory yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;