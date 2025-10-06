import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductDetail.module.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import { useCart } from '../context/CartContext';

// ✅ NEW IMPORT
import ProductCarousel from '../components/ProductCarousel';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ProductDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showLightbox, setShowLightbox] = useState(false);

  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategorySlug, setSubcategorySlug] = useState('');

  const productSlug = params.slug;

  // Scroll to top when component mounts or when productSlug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productSlug]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_BASE_URL}/products/${productSlug}/`, { headers });
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Product not found' : 'Failed to fetch product');
        }
        const productData = await response.json();
        setProduct(productData);

        if (productData.subcategory_detail) {
          setSubcategoryName(productData.subcategory_detail.name || '');
          setSubcategorySlug(productData.subcategory_detail.slug || '');
          if (productData.category) {
            setCategoryName(productData.category.name || '');
            setCategorySlug(productData.category.slug || '');
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
  }, [productSlug, token]);

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

  // Updated WhatsApp integration function with simplified message
  const handleWhatsAppClick = () => {
    if (!product) return;
    const message = `Hi, I'm interested in ${product.name} and would like to ask for prices`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/254117320000?text=${encodedMessage}`;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_inquiry_detail', {
        event_category: 'engagement',
        event_label: product.name,
        product_id: product.id
      });
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  const renderTextList = (text) => {
    if (!text) return null;
    return String(text)
      .split(/\n/)
      .map(item => item.trim())
      .filter(item => item)
      .map((item, idx) => <li key={idx}>{item}</li>);
  };

  if (loading) {
    return <div className={styles.loadingContainer}><p>Loading product details...</p></div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Product</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className={styles.ctaButton}>Return to Home</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or may have been removed.</p>
        <button onClick={() => navigate('/')} className={styles.ctaButton}>Browse Products</button>
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
          {/* Left Side: Product Image and Documentation */}
          <div className={styles.leftColumn}>
            <div className={styles.imageArea}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.mainImage}
                onClick={() => setShowLightbox(true)}
                style={{ cursor: 'zoom-in' }}
                onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
              />
              {showLightbox && (
                <div className={styles.lightbox} onClick={() => setShowLightbox(false)}>
                  <img src={product.image} alt={product.name} className={styles.lightboxImage} />
                </div>
              )}
            </div>
            
            {product.documentation_url && (
              <div className={styles.documentation}>
                <b>Documentation:</b>{" "}
                <a href={product.documentation_url} target="_blank" rel="noopener noreferrer">
                  {product.documentation_label || 'View Documentation'}
                </a>
              </div>
            )}
          </div>

          {/* Right Side: Product Info */}
          <div className={styles.rightColumn}>
            <div className={styles.productInfo}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              
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
                <button className={styles.ctaButton} onClick={handleAddToCart}>Add to Cart</button>
                <button 
                  className={styles.askPriceButton}
                  onClick={handleWhatsAppClick}
                  aria-label={`Ask for prices on ${product.name} via WhatsApp`}
                  title="Ask for Prices via WhatsApp"
                >
                  <svg className={styles.whatsappIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..."/>
                  </svg>
                  Ask for Price
                </button>
              </div>
              
              <div className={styles.stockStatus}>
                IN STOCK
              </div>
            </div>
          </div>
        </div>

        {/* Description and Features */}
        <div className={styles.descriptionFeaturesSection}>
          {product.description && (
            <div className={styles.description}>
              <b>Description:</b>
              <p>{product.description}</p>
            </div>
          )}

          {product.features && (
            <div className={styles.featuresStandalone}>
              <b>Features:</b>
              <ul className={styles.featureList}>
                {renderTextList(product.features)}
              </ul>
            </div>
          )}
        </div>

        {/* Specifications Section */}
        {product.spec_tables && product.spec_tables.length > 0 && (
          <div className={styles.fullWidthSections}>
            <div className={styles.specs}>
              <b>Specifications:</b>
              {product.spec_tables.map((table, tableIdx) => (
                <div key={tableIdx} className={styles.specTableWrapper}>
                  {table.title && <h4>{table.title}</h4>}
                  <table className={styles.specTable}>
                    <tbody>
                      {table.rows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          <td className={styles.specKey}>{row.key}</td>
                          <td className={styles.specValue}>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ NEW Related Products Carousel Section */}
        <ProductCarousel productSlug={productSlug} />

      </section>
    </div>
  );
};

export default ProductDetail;
