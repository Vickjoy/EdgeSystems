import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import CompanyLogo from '../assets/Company_logo.webp';
import styles from './Header.module.css';
import { fetchCategories } from '../utils/api';
import ReactDOM from 'react-dom';

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0, width: 0 });
  const navigate = useNavigate();
  const fireRef = useRef();
  const ictRef = useRef();
  const allCategoriesRef = useRef();
  const allCategoriesBtnRef = useRef();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setCategories([]);
      }
    };
    loadCategories();
    const handleCategoriesUpdated = () => loadCategories();
    window.addEventListener('categoriesUpdated', handleCategoriesUpdated);
    return () => window.removeEventListener('categoriesUpdated', handleCategoriesUpdated);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        fireRef.current && !fireRef.current.contains(e.target) &&
        ictRef.current && !ictRef.current.contains(e.target) &&
        allCategoriesRef.current && !allCategoriesRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Position All Categories dropdown
  useEffect(() => {
    if (openDropdown === 'all' && allCategoriesBtnRef.current) {
      const rect = allCategoriesBtnRef.current.getBoundingClientRect();
      setDropdownPos({
        left: rect.left,
        top: rect.bottom,
        width: rect.width
      });
    }
  }, [openDropdown]);

  const fireCategories = categories.filter(cat => cat.type === 'fire');
  const ictCategories = categories.filter(cat => cat.type === 'ict');

  // All Categories dropdown rendered in a portal
  const allCategoriesDropdown = openDropdown === 'all' && ReactDOM.createPortal(
    <ul
      className={styles.dropdownMenu}
      ref={allCategoriesRef}
      style={{
        position: 'fixed',
        left: dropdownPos.left,
        top: dropdownPos.top,
        minWidth: dropdownPos.width,
        zIndex: 30000
      }}
    >
      {categories.map(cat => (
        <li key={cat.id}>
          <button
            className={styles.dropdownItem}
            onClick={() => {
              setOpenDropdown(null);
              navigate(`/category/${cat.slug}`);
            }}
          >
            {cat.name}
          </button>
        </li>
      ))}
    </ul>,
    document.body
  );

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
          {/* All Categories Dropdown */}
          <div className={`${styles.dropdownContainer} ${styles.headerDropdownContainer}`}>
            <button
              ref={allCategoriesBtnRef}
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'all' ? null : 'all')}
              style={{ minWidth: 160 }}
            >
              All Categories
            </button>
            {/* Dropdown is rendered in a portal */}
          </div>
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
          <li ref={fireRef} className={styles.dropdownContainer}>
            <button
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'fire' ? null : 'fire')}
            >
              Fire Safety Products & Services
            </button>
            {openDropdown === 'fire' && (
              <ul className={styles.dropdownMenu} style={{ left: 0, top: '100%' }}>
                {fireCategories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        setOpenDropdown(null);
                        navigate(`/category/${cat.slug}`);
                      }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li ref={ictRef} className={styles.dropdownContainer}>
            <button
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'ict' ? null : 'ict')}
            >
              ICT/Telecommunication Products & Services
            </button>
            {openDropdown === 'ict' && (
              <ul className={styles.dropdownMenu} style={{ left: 0, top: '100%' }}>
                {ictCategories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        setOpenDropdown(null);
                        navigate(`/category/${cat.slug}`);
                      }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li><Link to="/about" className={styles.navLink}>About Us</Link></li>
          <li><Link to="/contact" className={styles.navLink}>Contact Us</Link></li>
        </ul>
      </nav>
      {/* Render All Categories dropdown in a portal */}
      {allCategoriesDropdown}
    </header>
  );
};

export default Header;