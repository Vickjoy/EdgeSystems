import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductList.module.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import { fetchCategories, fetchSubcategories } from '../utils/api';

const ProductList = () => {
  const { category } = useParams();
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

  // Fetch categories on mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setCategories([]);
      }
    };
    getCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!category) {
      setSubcategories([]);
      return;
    }
    const selectedCategory = categories.find(cat => cat.slug === category || cat.name.toLowerCase().replace(/ /g, '-') === category);
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    const getSubcategories = async () => {
      try {
        const data = await fetchSubcategories(selectedCategory.id);
        setSubcategories(data);
      } catch (error) {
        setSubcategories([]);
      }
    };
    getSubcategories();
  }, [category, categories]);

  // Fetch products with pagination
  const fetchProducts = useCallback(async (reset = false) => {
    setLoading(true);
    let url = `http://127.0.0.1:8000/api/products?category=${category}&page=${page}&page_size=12`;
    if (subCategory && subCategory.id) url += `&subcategory=${subCategory.id}`;
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
  }, [category, subCategory, page]);

  // Reset products and page when category or subCategory changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [category, subCategory]);

  // Fetch products when page, category, or subCategory changes
  useEffect(() => {
    fetchProducts(page === 1);
    // eslint-disable-next-line
  }, [category, subCategory, page]);

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
    { label: location.pathname.startsWith('/fire-safety') ? 'Fire Safety' : 'ICT', path: location.pathname.startsWith('/fire-safety') ? '/fire-safety' : '/ict' },
    { label: category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), path: location.pathname },
    ...(subCategory ? [{ label: subCategory.name, path: '#' }] : [])
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
          {/* Main content: Product Grid */}
          <div style={{ flex: 1 }}>
            <h2 className={styles.title}>{category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Products</h2>
            {/* Product Grid: Only show if there are products */}
            {products.length > 0 ? (
              <div className={styles.productsGrid}>
                {products.map((product, idx) => {
                  if (products.length === idx + 1) {
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

export default ProductList;