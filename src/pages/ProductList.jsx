import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductList.module.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import { fetchCategories, fetchSubcategories } from '../utils/api';


const ProductList = () => {
  const { categorySlug, slug } = useParams();
  const category = categorySlug || slug || '';
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategory, setSubCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { user, token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // If search results are passed via location.state, use them
  const isSearchResults = location.pathname.startsWith('/search');
  const searchResults = location.state && location.state.results;

  useEffect(() => {
    if (isSearchResults && Array.isArray(searchResults)) {
      setProducts(searchResults);
      setLoading(false);
      setSubcategories([]);
      return;
    }
    setLoading(true);
    // Fetch categories on mount
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setCategories([]);
      }
    };
    getCategories();
  }, [isSearchResults, searchResults]);

  // Only fetch subcategories/products if not search results
  useEffect(() => {
    if (isSearchResults) return;
    if (!category) {
      setSubcategories([]);
      return;
    }
    const selectedCategory = categories.find(cat => cat.slug === category);
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    const getSubcategories = async () => {
      try {
        // Use slug in the endpoint if your backend supports it, otherwise keep using id
        const data = await fetchSubcategories(selectedCategory.slug);
        setSubcategories(data);
        // Auto-select the first subcategory if none is selected
        if ((!subCategory || !subCategory.slug) && Array.isArray(data) && data.length > 0) {
          setSubCategory(data[0]);
        }
      } catch (error) {
        setSubcategories([]);
      }
    };
    getSubcategories();
  }, [category, categories, isSearchResults]);

  // Only fetch products if not search results
  const fetchProducts = useCallback(async (reset = false) => {
    if (isSearchResults) return;
    // Only fetch when a subcategory is selected
    if (!subCategory || !subCategory.slug) return;
    setLoading(true);
    let url = `http://127.0.0.1:8000/api/subcategories/${subCategory.slug}/products/?page=${page}&page_size=40`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (reset) {
        setProducts(data.results || data);
      } else {
        setProducts(prev => [...prev, ...(data.results || data)]);
      }
      setHasMore(data.next !== null && data.next !== undefined);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [category, subCategory, page, isSearchResults]);

  // Reset products and page when category or subCategory changes
  useEffect(() => {
    if (isSearchResults) return;
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [category, subCategory, isSearchResults]);

  // Fetch products when page, category, or subCategory changes
  useEffect(() => {
    if (isSearchResults) return;
    fetchProducts(page === 1);
    const handleProductsUpdated = () => fetchProducts(true);
    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdated);
    // eslint-disable-next-line
  }, [category, subCategory, page, isSearchResults]);

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

  // Handle product deletion
  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Breadcrumbs logic
  const crumbs = [
    { label: 'Home', path: '/' },
    isSearchResults
      ? { label: `Search Results`, path: location.pathname }
      : { label: location.pathname.startsWith('/fire-safety') ? 'Fire Safety' : 'ICT', path: location.pathname.startsWith('/fire-safety') ? '/fire-safety' : '/ict' },
    ...(isSearchResults ? [] : [{ label: category ? category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '', path: location.pathname }]),
    ...(subCategory && !isSearchResults ? [{ label: subCategory.name, path: '#' }] : [])
  ];

  return (
    <div>
      <Breadcrumbs crumbs={crumbs} />
      <section className={styles.section}>
        <div className={styles.container} style={{ display: 'flex', gap: '2rem' }}>
          {/* Sidebar with subcategories - hide for search results */}
          {!isSearchResults && (
            <aside style={{ minWidth: 220 }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Subcategories</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {subcategories.length === 0 && <li style={{ color: 'white' }}>No subcategories</li>}
                {subcategories.map(sub => (
                  <li key={sub.id}>
                    <button
                      style={{
                        background: subCategory?.id === sub.id ? '#1DCD9F' : 'white',
                        color: subCategory?.id === sub.id ? 'white' : '#6096B4',
                        border: 'none',
                        borderRadius: 4,
                        padding: '0.5rem 1rem',
                        marginBottom: 8,
                        width: '100%',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                      onClick={() => setSubCategory(sub)}
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}
          {/* Main content: Product Grid */}
          <div style={{ flex: 1 }}>
            <h2 className={styles.title}>{isSearchResults ? `Search Results` : category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' Products'}</h2>
            {/* Product Grid: Only show if there are products */}
            {products.length > 0 ? (
              <div className={styles.productsGrid}>
                {products.map((product, idx) => {
                  if (products.length === idx + 1 && !isSearchResults) {
                    return (
                      <div ref={lastProductRef} key={product.id}>
                        <ProductCard product={product} onDelete={handleDelete} />
                      </div>
                    );
                  } else {
                    return <ProductCard key={product.id} product={product} onDelete={handleDelete} />;
                  }
                })}
                {loading && <p>Loading...</p>}
                {!hasMore && !loading && products.length > 0 && !isSearchResults && <p style={{ color: 'white', textAlign: 'center', marginTop: 16 }}>No more products.</p>}
              </div>
            ) : (
              !loading && <p style={{ color: 'white', textAlign: 'center', marginTop: 32, fontSize: 18 }}>{isSearchResults ? 'No results found.' : 'No products in this subcategory yet.'}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductList;