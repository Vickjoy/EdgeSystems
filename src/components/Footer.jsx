import React from 'react';
import { Link } from 'react-router-dom';
import CompanyLogo from '../assets/Company_logo.webp';
import InstagramIcon from '../assets/Instagram.png';
import LinkedInIcon from '../assets/LinkedIn.png';
import TiktokIcon from '../assets/Tiktok.png';
import FacebookIcon from '../assets/Facebook.png';
import WhatsAppIcon from '../assets/whatsapp.png';
import styles from './Footer.module.css';

const Footer = () => {
  // Function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      {/* Left Column */}
      <div>
        <img src={CompanyLogo} alt="Edge Systems Logo" className={styles.logo} />
        <p className="mb-4">
          Edge Systems Ltd is a trusted provider of integrated safety and technology solutions in Kenya. 
          Our core expertise lies in fire safety systems, including advanced alarm and detection 
          solutions that protect lives and property. We also deliver structured cabling, 
          VoIP and telecommunication systems, CCTV/IP surveillance, and renewable solar energy solutions. 
          From small offices to large enterprises, our mission is to keep environments safe, 
          connected, and energy-efficient with reliable, future-ready technology.
        </p>
        <div className={styles.socialLinks}>
          <a 
            href="https://www.linkedin.com/in/edge-systems-903b32222?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={LinkedInIcon} alt="LinkedIn" className={styles.socialIcon} />
          </a>
          <a 
            href="https://www.facebook.com/edgesystemslimited" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={FacebookIcon} alt="Facebook" className={styles.socialIcon} />
          </a>
          <a 
            href="https://www.instagram.com/edge_systems.co.ke?utm_source=qr&igsh=aHpldnhnZnRmYjM3" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={InstagramIcon} alt="Instagram" className={styles.socialIcon} />
          </a>
          <a 
            href="https://www.tiktok.com/@edgesystems6?_t=ZM-8yCr3l8iIwn&_r=1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={TiktokIcon} alt="TikTok" className={styles.socialIcon} />
          </a>
          <a 
            href="https://wa.me/254117320000" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={WhatsAppIcon} alt="WhatsApp" className={styles.socialIcon} />
          </a>
        </div>
      </div>

      {/* Middle Column */}
      <div>
        <h3 className={styles.sectionTitle}>Quick Links</h3>
        <ul className={styles.quickLinks} role="navigation" aria-label="Quick Links">
          <li>
            <Link 
              to="/" 
              className={styles.quickLink} 
              tabIndex={0}
              onClick={scrollToTop}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={styles.quickLink} 
              tabIndex={0}
              onClick={scrollToTop}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={styles.quickLink} 
              tabIndex={0}
              onClick={scrollToTop}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Column */}
      <div>
        <h3 className={styles.sectionTitle}>Contact Info</h3>
        <ul className={styles.contactInfo}>
          <li className={styles.contactItem}>
            <span>📍 Shelter House, Dai Dai Road, South B, 4th Floor Apartment 4F31, Nairobi 43322-00100, Kenya</span>
          </li>
          <li className={styles.contactItem}>
            <span>☎️ +254721247356 / +254117320000</span>
          </li>
          <li className={styles.contactItem}>
            <span>📧 info@edgesystems.co.ke</span>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
