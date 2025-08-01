import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductDetail.module.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import { fetchCategories } from '../utils/api';
import { useCart } from '../context/CartContext';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ProductDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(location.pathname.startsWith('/product/edit/'));
  const productSlug = params.slug;
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategorySlug, setSubcategorySlug] = useState('');
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${productSlug}/`);
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Product not found' : 'Failed to fetch product');
        }

        const productData = await response.json();
        
        // Ensure critical fields exist and set defaults for optional fields
        if (!productData || !productData.name) {
          throw new Error('Invalid product data received');
        }

        setProduct({
          ...productData,
          description: productData.description || '',
          specifications: productData.specifications || '',
          features: productData.features || '',
          image: productData.image || '/placeholder.png',
          documentation: productData.documentation || null
        });

        // Fetch category details if needed
        if (productData.subcategory) {
          try {
            const subcategoryResponse = await fetch(`${API_BASE_URL}/subcategories/${productData.subcategory}/`);
            if (subcategoryResponse.ok) {
              const subcategoryData = await subcategoryResponse.json();
              setSubcategoryName(subcategoryData.name || '');
              setSubcategorySlug(subcategoryData.slug || '');

              if (subcategoryData.category) {
                const categories = await fetchCategories();
                const category = categories.find(c => 
                  c.id === subcategoryData.category || 
                  c.slug === subcategoryData.category
                );
                if (category) {
                  setCategoryName(category.name || '');
                  setCategorySlug(category.slug || '');
                }
              }
            }
          } catch (err) {
            console.error('Error fetching subcategory:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productSlug]);

  const handleEditSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productSlug}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setEditMode(false);
      navigate(`/product/${productSlug}`);
    } catch (err) {
      console.error('Error updating product:', err);
      alert(`Error updating product: ${err.message}`);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/order-summary');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  const renderTextList = (text) => {
    if (!text) return null;
    return String(text).split(/[.,\n]/)
      .map(item => item.trim())
      .filter(item => item)
      .map((item, idx) => <li key={idx}>{item}</li>);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Product</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className={styles.ctaButton}>
          Return to Home
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or may have been removed.</p>
        <button onClick={() => navigate('/')} className={styles.ctaButton}>
          Browse Products
        </button>
      </div>
    );
  }

  if (editMode) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <ProductForm
          initialValues={product}
          onSubmit={handleEditSubmit}
          onCancel={() => navigate(`/product/${productSlug}`)}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs crumbs={[
        { label: 'Home', path: '/' },
        ...(categoryName && categorySlug ? [{ label: categoryName, path: `/category/${categorySlug}` }] : []),
        ...(subcategoryName && subcategorySlug ? [{ label: subcategoryName, path: `/category/${categorySlug}#${subcategorySlug}` }] : []),
        { label: product.name, path: `/product/${product.slug}` }
      ]} />

      <section className={styles.section}>
        <div className={styles.detailContainer}>
          <div className={styles.imageArea}>
            <img
              src={product.image}
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
                  src={product.image}
                  alt={product.name}
                  className={styles.lightboxImage}
                />
              </div>
            )}
            {product.documentation && (
              <div className={styles.documentation}>
                <b>Documentation:</b> 
                <a href={product.documentation} target="_blank" rel="noopener noreferrer">
                  {product.documentation}
                </a>
              </div>
            )}
          </div>

          <div className={styles.infoArea}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <div className={styles.vatText}>incl +16% VAT</div>
            <div className={styles.productPrice}>
              KES {Number(product.price).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
            </div>
            
            <div className={styles.ctaRow}>
              <div className={styles.quantityArea}>
                <label htmlFor="quantity" className={styles.label}>Quantity</label>
                <input 
                  type="number" 
                  id="quantity" 
                  value={quantity} 
                  min="1" 
                  className={styles.quantityInput} 
                  onChange={handleQuantityChange}
                />
              </div>
              
              <button className={styles.ctaButton} onClick={handleAddToCart}>
                Add to Cart
              </button>
              
              <button className={styles.ctaButtonAlt} onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
            
            <div className={styles.stockStatus}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.detailsSection}>
          {product.description && (
            <div className={styles.description}>
              <b>Description:</b>
              <ul className={styles.descList}>
                {renderTextList(product.description)}
              </ul>
            </div>
          )}

          {product.specifications && (
            <div className={styles.specs}>
              <b>Specifications:</b>
              <ul className={styles.specList}>
                {renderTextList(product.specifications)}
              </ul>
            </div>
          )}

          {product.features && (
            <div className={styles.features}>
              <b>Features:</b>
              <ul className={styles.featureList}>
                {renderTextList(product.features)}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;