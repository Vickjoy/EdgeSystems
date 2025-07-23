import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import CompanyLogo from '../assets/Company_logo.webp';
import styles from './Header.module.css';
import { fetchCategories } from '../utils/api';
import ReactDOM from 'react-dom';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0, width: 0 });
  const navigate = useNavigate();
  const fireRef = useRef();
  const ictRef = useRef();
  const allCategoriesRef = useRef();
  const allCategoriesBtnRef = useRef();
  const { cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

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

  console.log('categories:', categories, 'openDropdown:', openDropdown);
  // All Categories dropdown using portal, always on top
  const [dropdownCoords, setDropdownCoords] = useState({ left: 0, top: 0, width: 0 });

  useEffect(() => {
    if (openDropdown === 'all' && allCategoriesBtnRef.current) {
      const rect = allCategoriesBtnRef.current.getBoundingClientRect();
      setDropdownCoords({ left: rect.left, top: rect.bottom, width: rect.width });
    }
  }, [openDropdown]);

  const allCategoriesDropdown =
    openDropdown === 'all'
      ? ReactDOM.createPortal(
          <ul
            className={styles.dropdownMenu}
            style={{
              position: 'fixed',
              left: dropdownCoords.left,
              top: dropdownCoords.top,
              minWidth: dropdownCoords.width,
              zIndex: 99999,
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
        )
      : null;

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <span>0721247356/0117320000</span>
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
          <div className={`${styles.dropdownContainer} ${styles.headerDropdownContainer}`} style={{ position: 'relative' }}>
            <button
              ref={allCategoriesBtnRef}
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'all' ? null : 'all')}
              style={{ minWidth: 160 }}
            >
              All Categories
            </button>
            {allCategoriesDropdown}
          </div>
          <SearchBar />
          <button onClick={() => setCartOpen(true)} style={{ background: 'none', border: 'none', color: '#97FEED', fontSize: 22, cursor: 'pointer', position: 'relative' }}>
            🛒
            {cartItems.length > 0 && (
              <span style={{ position: 'absolute', top: -6, right: -8, background: '#e74c3c', color: 'white', borderRadius: '50%', fontSize: 13, padding: '0 6px', fontWeight: 700 }}>{cartItems.length}</span>
            )}
          </button>
        </div>
        <div>
          <Link to="/login" className={styles.loginLink}>
            👤 Login
          </Link>
        </div>
      </div>
      {/* Bottom Bar */}
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li><Link to="/" className={styles.navLink}>Home</Link></li>
          <li ref={fireRef} className={styles.dropdownContainer} style={{ position: 'relative' }}>
            <button
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'fire' ? null : 'fire')}
            >
              Fire Safety Products & Services
            </button>
            {openDropdown === 'fire' && (
              <ul className={styles.dropdownMenu} style={{ left: 0, top: '100%', position: 'absolute', zIndex: 9999 }}>
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
          <li ref={ictRef} className={styles.dropdownContainer} style={{ position: 'relative' }}>
            <button
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'ict' ? null : 'ict')}
            >
              ICT/Telecommunication Products & Services
            </button>
            {openDropdown === 'ict' && (
              <ul className={styles.dropdownMenu} style={{ left: 0, top: '100%', position: 'absolute', zIndex: 9999 }}>
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
      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </header>
  );
};

export default Header;