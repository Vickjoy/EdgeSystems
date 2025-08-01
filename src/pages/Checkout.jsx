import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './Checkout.module.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import PaymentImage from '../assets/Payment.jpg';

const mpesaImage = PaymentImage; // Now using the Payment image

const Checkout = () => {
  const { cartItems, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Checkout', path: '/checkout' }]} />
      <section className={styles.section}>
        <div style={{ maxWidth: 900, margin: '0 auto 1.5rem auto', display: 'flex', justifyContent: 'flex-start' }}>
          <button
            style={{ background: '#eee', color: '#6096B4', fontWeight: 700, padding: '0.5rem 1.5rem', borderRadius: 25, border: 'none', fontSize: 16, cursor: 'pointer' }}
            onClick={() => navigate('/order-summary')}
          >
            ← Back
          </button>
        </div>
        <div className={styles.gridContainer}>
          {/* Billing Information */}
          <div className={styles.billingColumn}>
            <h2 className={styles.header}>Billing Information</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.label}>First Name</label>
                <input type="text" id="firstName" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                <input type="text" id="lastName" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="companyName" className={styles.label}>Company Name (optional)</label>
                <input type="text" id="companyName" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.label}>Country</label>
                <input type="text" id="country" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="streetAddress" className={styles.label}>Street Address</label>
                <input type="text" id="streetAddress" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="state" className={styles.label}>State/County</label>
                <input type="text" id="state" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="postcode" className={styles.label}>Postcode</label>
                <input type="text" id="postcode" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                <input type="tel" id="phone" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input type="email" id="email" className={styles.input} required />
              </div>
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </form>
          </div>

          {/* Order & Payment Section */}
          <div className={styles.orderColumn}>
            {/* Your Order Card */}
            <div className={styles.orderCard}>
              <h3 className={styles.orderHeader}>Your Order</h3>
              <ul className={styles.orderList}>
                {cartItems.length === 0 ? (
                  <li className={styles.emptyOrder}>Your cart is empty.</li>
                ) : (
                  cartItems.map(item => (
                    <li key={item.id} className={styles.orderItem}>
                      <span className={styles.orderItemName}>{item.name || `Product #${item.id}`}</span>
                      <span className={styles.orderItemPrice}>KES {(item.price * (item.quantity || 1)).toLocaleString('en-KE', { minimumFractionDigits: 2 })} ({item.quantity || 1}x)</span>
                      <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn} title="Remove">×</button>
                    </li>
                  ))
                )}
              </ul>
              <div className={styles.orderTotal}>
                Total: KES {getTotal().toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Payment Card */}
            <div className={styles.paymentCard}>
              <h3 className={styles.paymentHeader}>Payment</h3>
              <div className={styles.paymentMpesa}>Lipa na Mpesa</div>
              <div className={styles.paymentImage}>
                {/* Replace with actual image when available */}
                {mpesaImage ? (
                  <img 
                    src={mpesaImage} 
                    alt="Mpesa Payment Details" 
                    style={{ maxWidth: '400px', maxHeight: '500px', width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} 
                  />
                ) : (
                  <div style={{ background: '#eee', height: 120, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>[Mpesa Payment Image Here]</div>
                )}
              </div>
              <button className={styles.placeOrderButton} style={{ marginTop: 16, width: '100%' }}>
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