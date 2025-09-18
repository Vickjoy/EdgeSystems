import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './Checkout.module.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import PaymentImage from '../assets/Payment.jpg';

const mpesaImage = PaymentImage;

const Checkout = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate totals
  const totalBeforeTax = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const taxRate = 0.16; // 16%
  const taxAmount = totalBeforeTax * taxRate;
  const totalWithTax = totalBeforeTax + taxAmount;

  return (
    <div className={styles.container}>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Checkout', path: '/checkout' }]} />
      <section className={styles.section}>
        <div className={styles.backButtonContainer}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/order-summary')}
          >
            ← Back
          </button>
        </div>
        <div className={styles.gridContainer}>
          {/* Billing Information */}
          <div className={styles.billingColumn}>
            <div className={styles.billingCard}>
              <h2 className={styles.header}>Billing Information</h2>
              <form className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>First Name</label>
                    <input type="text" id="firstName" className={styles.input} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>Last Name</label>
                    <input type="text" id="lastName" className={styles.input} required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="companyName" className={styles.label}>Company Name (optional)</label>
                  <input type="text" id="companyName" className={styles.input} />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="country" className={styles.label}>Country</label>
                    <input type="text" id="country" className={styles.input} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="state" className={styles.label}>State/County</label>
                    <input type="text" id="state" className={styles.input} required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="streetAddress" className={styles.label}>Street Address</label>
                  <input type="text" id="streetAddress" className={styles.input} required />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="postcode" className={styles.label}>Postcode</label>
                    <input type="text" id="postcode" className={styles.input} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>Phone Number</label>
                    <input type="tel" id="phone" className={styles.input} required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input type="email" id="email" className={styles.input} required />
                </div>
                <button type="submit" className={styles.submitButton}>
                  Submit Billing Information
                </button>
              </form>
            </div>
          </div>

          {/* Order & Payment Section */}
          <div className={styles.orderColumn}>
            {/* Your Order Card */}
            <div className={styles.orderCard}>
              <h3 className={styles.orderHeader}>Your Order</h3>
              <div className={styles.orderItems}>
                {cartItems.length === 0 ? (
                  <div className={styles.emptyOrder}>Your cart is empty.</div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className={styles.orderItem}>
                      <div className={styles.orderItemInfo}>
                        <span className={styles.orderItemName}>{item.name || `Product #${item.id}`}</span>
                        <span className={styles.orderItemDetails}>
                          Qty: {item.quantity || 1} × KES {Number(item.price).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className={styles.orderItemActions}>
                        <span className={styles.orderItemPrice}>
                          KES {(item.price * (item.quantity || 1)).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className={styles.removeBtn} 
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {cartItems.length > 0 && (
                <div className={styles.orderSummary}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>KES {totalBeforeTax.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Total VAT (16%):</span>
                    <span>KES {taxAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total:</span>
                    <span>KES {totalWithTax.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Card */}
            <div className={styles.paymentCard}>
              <h3 className={styles.paymentHeader}>Payment</h3>
              <div className={styles.paymentMpesa}>Lipa na M-Pesa</div>
              <div className={styles.paymentImage}>
                {mpesaImage ? (
                  <img 
                    src={mpesaImage} 
                    alt="M-Pesa Payment Details" 
                    className={styles.mpesaImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    [M-Pesa Payment Image Here]
                  </div>
                )}
              </div>
              <button className={styles.placeOrderButton} disabled={cartItems.length === 0}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;