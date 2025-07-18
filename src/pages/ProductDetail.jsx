import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductDetail.module.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import { fetchCategories, fetchSubcategories } from '../utils/api';

const ProductDetail = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(location.pathname.startsWith('/product/edit/'));
  const productId = params.id;
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategorySlug, setSubcategorySlug] = useState('');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${productId}`)
      .then(response => response.json())
      .then(async data => {
        setProduct(data);
        setLoading(false);
        // Try to fetch subcategory and category names if possible
        if (data.subcategory) {
          // Fetch subcategory details
          try {
            const subcategoryResp = await fetch(`http://127.0.0.1:8000/api/subcategories/${data.subcategory}/`);
            if (subcategoryResp.ok) {
              const subcat = await subcategoryResp.json();
              setSubcategoryName(subcat.name);
              setSubcategorySlug(subcat.slug);
              // Fetch category name
              if (subcat.category) {
                const categories = await fetchCategories();
                const cat = categories.find(c => c.id === subcat.category || c.slug === subcat.category);
                if (cat) {
                  setCategoryName(cat.name);
                  setCategorySlug(cat.slug);
                }
              }
            }
          } catch {}
        }
      })
      .catch(error => console.error('Error fetching product details:', error));
  }, [productId]);

  const handleEditSubmit = async (form) => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      if (form.image && typeof form.image !== 'string') {
        formData.append('image', form.image);
      }
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to update product');
      navigate(`/product/${productId}`);
    } catch (err) {
      alert('Error updating product.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (editMode) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <ProductForm
          initialValues={product}
          onSubmit={handleEditSubmit}
          onCancel={() => navigate(`/product/${productId}`)}
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs crumbs={[
        { label: 'Home', path: '/' },
        ...(categoryName && categorySlug ? [{ label: categoryName, path: `/category/${categorySlug}` }] : []),
        ...(subcategoryName && subcategorySlug ? [{ label: subcategoryName, path: `/subcategory/${subcategorySlug}` }] : []),
        { label: product.name, path: `/product/${product.id}` }
      ]} />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.productLayout}>
            {/* Image on the left */}
            <div className={styles.imageContainer}>
              <img
                src={product.image ? product.image : '/placeholder.png'}
                alt={product.name}
                className={styles.productImage}
                style={{ maxWidth: 400, width: '100%', background: '#f4f4f4', borderRadius: 8 }}
                onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
              />
              {product.documentation && (
                <div style={{ marginTop: 16, textAlign: 'center', wordBreak: 'break-all' }}>
                  <b>Documentation:</b> <a href={product.documentation} target="_blank" rel="noopener noreferrer">{product.documentation}</a>
                </div>
              )}
            </div>
            {/* Details on the right */}
            <div className={styles.detailsContainer}>
              <h2 className={styles.productTitle}>{product.name}</h2>
              <div style={{ color: '#1DCD9F', fontWeight: 600, fontSize: 15, marginBottom: 0 }}>inclusive +16% VAT</div>
              <div className={styles.productPrice}>
                KES {(product.price * 1.16).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                <label htmlFor="quantity" className={styles.label}>Quantity</label>
                <input type="number" id="quantity" defaultValue="1" min="1" className={styles.quantityInput} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <button className={styles.addToCartButton} style={{ flex: 1 }}>Add to Cart</button>
                <button className={styles.addToCartButton} style={{ flex: 1, background: '#1DCD9F' }}>Buy Now</button>
              </div>
            </div>
          </div>
          {/* Below image and details: description, specifications, benefits/features */}
          <div style={{ background: 'white', color: '#333', borderRadius: 12, marginTop: 32, padding: 32, boxShadow: '0 4px 32px rgba(96,150,180,0.08)' }}>
            <div style={{ marginBottom: 16 }}><b>Description:</b> {product.description}</div>
            <div style={{ marginBottom: 16 }}><b>Specifications:</b> {product.specifications}</div>
            {product.features && (
              <div style={{ marginBottom: 16 }}><b>Benefits:</b> {product.features}</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;