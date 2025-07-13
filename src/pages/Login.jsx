import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './Login.module.css';

const Login = () => {
  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Login', path: '/login' }]} />
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Login</h2>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input type="email" id="email" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input type="password" id="password" className={styles.input} />
            </div>
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;