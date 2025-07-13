import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import CategoryMenu from './CategoryMenu';
import CompanyLogo from '../assets/Company_logo.webp';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <span>☎️ +254 700 000000</span>
          <span>📧 info@edgesystems.co.ke</span>
        </div>
      </div>
      {/* Middle Bar */}
      <div className={styles.mainHeader}>
        <div>
          <img src={CompanyLogo} alt="Edge Systems Logo" className={styles.logo} />
        </div>
        <div className={styles.headerActions}>
          <CategoryMenu />
          <SearchBar />
        </div>
        <div>
          <Link to="/login" className={styles.loginLink}>
            👤 Login
          </Link>
          <Link to="/cart" className={styles.cartLink}>
            🛒 Cart (0)
          </Link>
        </div>
      </div>
      {/* Bottom Bar */}
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li><Link to="/" className={styles.navLink}>Home</Link></li>
          <li className={styles.dropdownContainer}>
            <button className={styles.dropdownButton}>
              Fire Safety Products & Services
            </button>
            <ul className={styles.dropdownMenu}>
              <li><Link to="/fire-safety/alarm-detection" className={styles.dropdownItem}>Fire Alarm & Detection</Link></li>
              <li><Link to="/fire-safety/suppression" className={styles.dropdownItem}>Fire Suppression</Link></li>
              <li><Link to="/fire-safety/prevention" className={styles.dropdownItem}>Fire Prevention</Link></li>
              <li><Link to="/fire-safety/accessories" className={styles.dropdownItem}>Accessories</Link></li>
            </ul>
          </li>
          <li className={styles.dropdownContainer}>
            <button className={styles.dropdownButton}>
              ICT & Telecommunication Products & Services
            </button>
            <ul className={styles.dropdownMenu}>
              <li><Link to="/ict/networking" className={styles.dropdownItem}>Networking</Link></li>
              <li><Link to="/ict/cabling" className={styles.dropdownItem}>Cabling</Link></li>
              <li><Link to="/ict/communication" className={styles.dropdownItem}>Communication</Link></li>
            </ul>
          </li>
          <li><Link to="/about" className={styles.navLink}>About Us</Link></li>
          <li><Link to="/contact" className={styles.navLink}>Contact Us</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;