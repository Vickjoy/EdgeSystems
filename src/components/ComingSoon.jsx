import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ComingSoon.module.css';
import ComingSoonImage from '../assets/ComingSoon.jpg';

const ComingSoon = () => {
  return (
    <div className={styles.comingSoonContainer}>
      {/* Background Image */}
      <div 
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${ComingSoonImage})` }}
      >
        <div className={styles.overlay}></div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.contentBox}>
          <h1 className={styles.title}>
            Solar Power Solutions
          </h1>
          <h2 className={styles.subtitle}>
            Coming Soon
          </h2>
          <p className={styles.description}>
            We're working hard to bring you the best solar energy solutions. 
            Our solar products and services will be available soon!
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>☀️</span>
              <span className={styles.featureText}>Solar Panels</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔋</span>
              <span className={styles.featureText}>Battery Storage</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <span className={styles.featureText}>Inverters</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link to="/" className={styles.homeButton}>
              Back to Home
            </Link>
            <Link to="/contact" className={styles.contactButton}>
              Contact Us for More Info
            </Link>
          </div>

          <p className={styles.notification}>
            Want to be notified when we launch? Contact us today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;