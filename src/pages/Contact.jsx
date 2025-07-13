import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Contact Us', path: '/contact' }]} />
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Contact Us</h2>
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
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea id="message" rows="4" className={styles.textarea}></textarea>
            </div>
            <button type="submit" className={styles.button}>
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;