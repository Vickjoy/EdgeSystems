import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './ProductDetail.module.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import { useCart } from '../context/CartContext';

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

  // WhatsApp integration function
  const handleWhatsAppClick = () => {
    if (!product) return;
    
    // Create the product URL
    const productUrl = `${window.location.origin}/product/${product.slug}`;
    
    // Create the prefilled message
    const message = `Hi — I'm interested in ${product.name} (SKU: ${product.id}) — ${productUrl}`;
    
    // URL encode the message
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL (E.164 format without +)
    const whatsappUrl = `https://wa.me/254117320000?text=${encodedMessage}`;
    
    // Track analytics event (optional)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_inquiry_detail', {
        event_category: 'engagement',
        event_label: product.name,
        product_id: product.id
      });
    }
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  // ✅ FIXED: only split on new lines, not commas or dots
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

          {/* Right Side: Product Info, Price, Actions, Status, and Features */}
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
              </div>

              {/* WhatsApp Button - Prominent placement */}
              <div className={styles.whatsappSection}>
                <button 
                  className={styles.whatsappButton}
                  onClick={handleWhatsAppClick}
                  aria-label={`Ask for prices on ${product.name} via WhatsApp`}
                  title="Ask for Prices via WhatsApp"
                >
                  <svg className={styles.whatsappIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Ask for Prices
                </button>
              </div>
              
              <div className={styles.stockStatus}>
                IN STOCK
              </div>
            </div>
          </div>
        </div>

        {/* Description and Features Side by Side */}
        <div className={styles.descriptionFeaturesSection}>
          {/* Description Section */}
          {product.description && (
            <div className={styles.description}>
              <b>Description:</b>
              <p>{product.description}</p>
            </div>
          )}

          {/* Features Section */}
          {product.features && (
            <div className={styles.featuresStandalone}>
              <b>Features:</b>
              <ul className={styles.featureList}>
                {renderTextList(product.features)}
              </ul>
            </div>
          )}
        </div>

        {/* Specifications Section - Full Width Below */}
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
      </section>
    </div>
  );
};

export default ProductDetail;