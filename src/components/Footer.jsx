import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaTiktok } from 'react-icons/fa';
import CompanyLogo from '../assets/Company_logo.webp';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Left Column */}
      <div>
        <img src={CompanyLogo} alt="Edge Systems Logo" className={styles.logo} />
        <p className="mb-4">
          At Edge Systems Ltd, we provide reliable communication and security solutions, specializing in unified systems like Nortel, Alcatel-Lucent, and Avaya. We offer structured cabling, VoIP, wireless access, CCTV/IP cameras, and fire alarm systems, supporting businesses from small offices to large campuses. Our goal is to keep your networks connected and secure with smart, dependable technology.
        </p>
        <div className={styles.socialLinks}>
          <a href="https://www.linkedin.com " target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FaLinkedin className={styles.socialIcon} />
          </a>
          <a href="https://www.facebook.com " target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FaFacebook className={styles.socialIcon} />
          </a>
          <a href="https://www.instagram.com " target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FaInstagram className={styles.socialIcon} />
          </a>
          <a href="https://twitter.com " target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FaTwitter className={styles.socialIcon} />
          </a>
          <a href="https://www.tiktok.com " target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FaTiktok className={styles.socialIcon} />
          </a>
        </div>
      </div>
      {/* Middle Column */}
      <div>
        <h3 className={styles.sectionTitle}>Quick Links</h3>
        <ul className={styles.quickLinks} role="navigation" aria-label="Quick Links">
          <li><Link to="/" className={styles.quickLink} tabIndex={0}>Home</Link></li>
          <li><Link to="/about" className={styles.quickLink} tabIndex={0}>About Us</Link></li>
          <li><Link to="/contact" className={styles.quickLink} tabIndex={0}>Contact Us</Link></li>
        </ul>
      </div>
      {/* Right Column */}
      <div>
        <h3 className={styles.sectionTitle}>Contact Info</h3>
        <ul className={styles.contactInfo}>
          <li className={styles.contactItem}>
            <span>📍 Address: Nairobi, Kenya</span>
          </li>
          <li className={styles.contactItem}>
            <span>☎️ Phone: +254 700 000000</span>
          </li>
          <li className={styles.contactItem}>
            <span>📧 Email: info@edgesystems.co.ke</span>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;