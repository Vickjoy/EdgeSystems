import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductList.module.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';

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
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const { user, token } = useAuth();

  // Define subcategories for each main category
  const subcategories = {
    'alarm-detection': ['Smoke Detectors', 'Heat Detectors', 'Control Panels'],
    'suppression': ['Gas Suppression', 'Water Mist', 'Foam Systems'],
    'prevention': ['Fire Blankets', 'Signage', 'Extinguishers'],
    'accessories': ['Batteries', 'Cables', 'Mounting Kits'],
    'networking': ['Switches', 'Routers', 'Access Points'],
    'cabling': ['Copper', 'Fiber', 'Patch Panels'],
    'communication': ['VoIP Phones', 'PBX', 'Intercoms'],
  };

  // Fetch products with pagination
  const fetchProducts = useCallback(async (reset = false) => {
    setLoading(true);
    let url = `http://127.0.0.1:8000/api/products?category=${category}&page=${page}&page_size=12`;
    if (subCategory) url += `&subcategory=${subCategory}`;
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

  // Reset products when category or subCategory changes
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

  // Handle add product
  const handleAddProduct = async (form) => {
    setAddLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('category', form.category);
      if (form.image && typeof form.image !== 'string') {
        formData.append('image', form.image);
      }
      const response = await fetch('http://127.0.0.1:8000/api/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to add product');
      const newProduct = await response.json();
      setProducts(prev => [newProduct, ...prev]);
      setShowAdd(false);
    } catch (err) {
      alert('Error adding product.');
    } finally {
      setAddLoading(false);
    }
  };

  // Breadcrumbs logic
  const crumbs = [
    { label: 'Home', path: '/' },
    { label: location.pathname.startsWith('/fire-safety') ? 'Fire Safety' : 'ICT', path: location.pathname.startsWith('/fire-safety') ? '/fire-safety' : '/ict' },
    { label: category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), path: location.pathname },
    ...(subCategory ? [{ label: subCategory, path: '#' }] : [])
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
              {(subcategories[category] || []).map(sub => (
                <li key={sub}>
                  <button
                    style={{
                      background: subCategory === sub ? '#1DCD9F' : 'white',
                      color: subCategory === sub ? 'white' : '#6096B4',
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
                    {sub}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          {/* Main content: Product Grid */}
          <div style={{ flex: 1 }}>
            <h2 className={styles.title}>{category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Products</h2>
            {/* Add Product Button for Admins */}
            {user?.is_staff || user?.is_admin ? (
              <>
                <button
                  style={{ marginBottom: 16, background: '#1DCD9F', color: 'white', padding: '0.5rem 1.5rem', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setShowAdd(true)}
                >
                  + Add Product
                </button>
                {showAdd && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ProductForm
                      onSubmit={handleAddProduct}
                      onCancel={() => setShowAdd(false)}
                      loading={addLoading}
                    />
                  </div>
                )}
              </>
            ) : null}
            {/* Product Grid */}
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductList;