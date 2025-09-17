import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchCategories, fetchSubcategories, fetchProductsForSubcategory } from '../utils/api';
import styles from './CategoryPage.module.css';
import ProductCard from '../components/ProductCard';

// Import category images
import FireSafetyImg from '../assets/FireSafety.jpg';
import ICTImg from '../assets/ICT.webp';
import SolarImg from '../assets/Solare.webp';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get category-specific image and use actual category name as title
  const getCategoryDisplay = (category) => {
    if (!category) return { image: null, displayName: slug };
    
    const categoryType = String(category.type || '').toLowerCase();
    const categoryName = category.name.toLowerCase();
    
    // Fire Safety
    if (['fire_safety', 'fire', 'fire-safety', 'firesafety'].includes(categoryType) ||
        categoryName.includes('fire')) {
      return {
        image: FireSafetyImg,
        displayName: category.name
      };
    }
    
    // ICT/Telecommunication
    if (['ict', 'telecom', 'telecommunication'].includes(categoryType) ||
        categoryName.includes('ict') || categoryName.includes('telecom')) {
      return {
        image: ICTImg,
        displayName: category.name
      };
    }
    
    // Solar
    if (['solar', 'solar_solutions', 'solar-solutions'].includes(categoryType) ||
        categoryName.includes('solar')) {
      return {
        image: SolarImg,
        displayName: category.name
      };
    }
    
    // Default fallback
    return {
      image: null,
      displayName: category.name
    };
  };

  // Fetch category by slug
  useEffect(() => {
    const getCategory = async () => {
      try {
        const cats = await fetchCategories();
        const found = cats.find(cat => cat.slug === slug);
        setCategory(found || null);
        setSubcategories([]);
        setSelectedSubcategory(null);
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
        const filtered = subs.filter(sub => 
          sub.category === category.id || 
          sub.category === category.slug || 
          !sub.category || 
          sub.category === category
        );
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

  // Get category display info
  const categoryDisplay = getCategoryDisplay(category);

  // Breadcrumbs
  const crumbs = [
    { label: 'Home', path: '/' },
    { label: category ? category.name : slug, path: `/category/${slug}` },
    ...(selectedSubcategory ? [{ label: selectedSubcategory.name, path: '#' }] : [])
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Banner Section */}
      <div className={styles.heroSection}>
        <div 
          className={styles.heroBackground}
          style={{
            backgroundImage: categoryDisplay.image ? `url(${categoryDisplay.image})` : 'none',
            backgroundColor: categoryDisplay.image ? 'transparent' : '#6096B4'
          }}
        >
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {categoryDisplay.displayName}
            </h1>
          </div>
        </div>
      </div>

      {/* Breadcrumbs positioned immediately below hero */}
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumbs crumbs={crumbs} />
      </div>

      {/* Main Content Section */}
      <section className={styles.mainSection}>
        <div className={styles.containerLayout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <h3 className={styles.sidebarTitle}>Product Categories</h3>
              <div className={styles.subcategoryList}>
                {subcategories.length === 0 ? (
                  <div className={styles.noSubcategories}>
                    No subcategories available
                  </div>
                ) : (
                  subcategories.map(sub => (
                    <button
                      key={sub.id}
                      className={`${styles.subcategoryButton} ${
                        selectedSubcategory?.id === sub.id ? styles.active : ''
                      }`}
                      onClick={() => setSelectedSubcategory(sub)}
                    >
                      {sub.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={styles.mainContent}>
            {error && (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className={styles.productsGrid}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>📦</div>
                <h3>No Products Available</h3>
                <p>
                  {selectedSubcategory 
                    ? `No products are currently available in ${selectedSubcategory.name}.`
                    : 'Please select a subcategory to view products.'
                  }
                </p>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;