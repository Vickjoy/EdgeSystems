import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import CategoryMenu from './CategoryMenu';
import CompanyLogo from '../assets/Company_logo.webp';
import styles from './Header.module.css';

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const fireRef = useRef();
  const ictRef = useRef();
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        fireRef.current && !fireRef.current.contains(e.target) &&
        ictRef.current && !ictRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
          <li>
            <select
              className={styles.categoryDropdown}
              onChange={e => { if (e.target.value) navigate(e.target.value); }}
              defaultValue=""
            >
              <option value="" disabled>Fire Safety Products & Services</option>
              <option value="/fire-safety/alarm-detection">Fire Alarm & Detection</option>
              <option value="/fire-safety/suppression">Fire Suppression</option>
              <option value="/fire-safety/prevention">Fire Prevention</option>
              <option value="/fire-safety/accessories">Accessories</option>
            </select>
          </li>
          <li>
            <select
              className={styles.categoryDropdown}
              onChange={e => { if (e.target.value) navigate(e.target.value); }}
              defaultValue=""
            >
              <option value="" disabled>ICT & Telecommunication Products & Services</option>
              <option value="/ict/networking">Networking</option>
              <option value="/ict/cabling">Cabling</option>
              <option value="/ict/communication">Communication</option>
            </select>
          </li>
          <li><Link to="/about" className={styles.navLink}>About Us</Link></li>
          <li><Link to="/contact" className={styles.navLink}>Contact Us</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;