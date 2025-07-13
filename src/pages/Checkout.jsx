import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './Checkout.module.css';

const Checkout = () => {
  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Checkout', path: '/checkout' }]} />
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Checkout</h2>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input type="text" id="name" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input type="email" id="email" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>Address</label>
              <input type="text" id="address" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>City</label>
              <input type="text" id="city" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="state" className={styles.label}>State</label>
              <input type="text" id="state" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="zip" className={styles.label}>ZIP Code</label>
              <input type="text" id="zip" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="card" className={styles.label}>Credit Card Number</label>
              <input type="text" id="card" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="expiry" className={styles.label}>Expiry Date</label>
              <input type="text" id="expiry" placeholder="MM/YY" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cvv" className={styles.label}>CVV</label>
              <input type="text" id="cvv" className={styles.input} />
            </div>
            <button type="submit" className={styles.button}>
              Place Order
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Checkout;