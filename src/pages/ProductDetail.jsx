import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductDetail.module.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import { fetchCategories } from '../utils/api';
import { useCart } from '../context/CartContext';

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
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showLightbox, setShowLightbox] = useState(false);

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

  // Fallback: If categoryName or subcategoryName are missing, try to fetch them from product object if available
  useEffect(() => {
    if (product && (!categoryName || !subcategoryName)) {
      // If product.subcategory is an object with name/slug
      if (typeof product.subcategory === 'object' && product.subcategory !== null) {
        if (!subcategoryName && product.subcategory.name) setSubcategoryName(product.subcategory.name);
        if (!subcategorySlug && product.subcategory.slug) setSubcategorySlug(product.subcategory.slug);
        if (product.subcategory.category && typeof product.subcategory.category === 'object') {
          if (!categoryName && product.subcategory.category.name) setCategoryName(product.subcategory.category.name);
          if (!categorySlug && product.subcategory.category.slug) setCategorySlug(product.subcategory.category.slug);
        }
      }
    }
  }, [product, categoryName, subcategoryName, categorySlug, subcategorySlug]);

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
        ...(subcategoryName && subcategorySlug ? [{ label: subcategoryName, path: `/category/${categorySlug}#${subcategorySlug}` }] : []),
        { label: product.name, path: `/product/${product.id}` }
      ]} />
      <section className={styles.section}>
        <div className={styles.detailContainer}>
          <div className={styles.imageArea}>
            <img
              src={product.image ? product.image : '/placeholder.png'}
              alt={product.name}
              className={styles.mainImage}
              onClick={() => setShowLightbox(true)}
              tabIndex={0}
              style={{ cursor: 'zoom-in' }}
              onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
            />
            {showLightbox && (
              <div className={styles.lightbox} onClick={() => setShowLightbox(false)}>
                <img
                  src={product.image ? product.image : '/placeholder.png'}
                  alt={product.name}
                  className={styles.lightboxImage}
                />
              </div>
            )}
            {product.documentation && (
              <div className={styles.documentation}><b>Documentation:</b> <a href={product.documentation} target="_blank" rel="noopener noreferrer">{product.documentation}</a></div>
            )}
          </div>
          <div className={styles.infoArea}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <div className={styles.vatText}>incl +16% VAT</div>
            <div className={styles.productPrice}>KES {Number(product.price).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</div>
            <div className={styles.ctaRow}>
              <div className={styles.quantityArea}>
                <label htmlFor="quantity" className={styles.label}>Quantity</label>
                <input type="number" id="quantity" value={quantity} min="1" className={styles.quantityInput} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
              <button
                className={styles.ctaButton}
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity,
                })}
              >
                Add to Cart
              </button>
              <button
                className={styles.ctaButtonAlt}
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity,
                  });
                  navigate('/order-summary');
                }}
              >
                Buy Now
              </button>
            </div>
            <div className={styles.stockStatus}>In Stock</div>
          </div>
        </div>
        <hr className={styles.divider} />
        <div className={styles.detailsSection}>
          <div className={styles.description}><b>Description:</b>
            <ul className={styles.descList}>
              {product.description && product.description.split(/[.,\n]/).map((item, idx) => {
                const trimmed = item.trim();
                return trimmed ? <li key={idx}>{trimmed}</li> : null;
              })}
            </ul>
          </div>
          <div className={styles.specs}><b>Specifications:</b>
            <ul className={styles.specList}>
              {product.specifications && product.specifications.split(/[.,\n]/).map((item, idx) => {
                const trimmed = item.trim();
                return trimmed ? <li key={idx}>{trimmed}</li> : null;
              })}
            </ul>
          </div>
          {product.features && (
            <div className={styles.features}><b>Features:</b>
              <ul className={styles.featureList}>
                {product.features.split(/[.,\n]/).map((item, idx) => {
                  const trimmed = item.trim();
                  return trimmed ? <li key={idx}>{trimmed}</li> : null;
                })}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;