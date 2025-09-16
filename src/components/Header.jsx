import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import CompanyLogo from '../assets/Company_logo.webp';
import styles from './Header.module.css';
import { fetchCategories, fetchSubcategories } from '../utils/api';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaChevronDown } from "react-icons/fa";

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const navigate = useNavigate();
  const fireRef = useRef();
  const ictRef = useRef();
  const solarRef = useRef();
  const allCategoriesRef = useRef();
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

  const loadSubcategories = async (categorySlug) => {
    if (subcategoriesMap[categorySlug]) return;
    try {
      const subs = await fetchSubcategories(categorySlug);
      setSubcategoriesMap(prev => ({
        ...prev,
        [categorySlug]: Array.isArray(subs) ? subs : []
      }));
    } catch (e) {
      setSubcategoriesMap(prev => ({
        ...prev,
        [categorySlug]: []
      }));
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (
        fireRef.current && !fireRef.current.contains(e.target) &&
        ictRef.current && !ictRef.current.contains(e.target) &&
        solarRef.current && !solarRef.current.contains(e.target) &&
        allCategoriesRef.current && !allCategoriesRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
        setHoveredCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fireCategories = categories.filter(cat =>
    ['fire_safety','fire','fire-safety','firesafety'].includes(String(cat.type || '').toLowerCase())
  );

  const ictCategories = categories.filter(cat =>
    ['ict','telecom','telecommunication'].includes(String(cat.type || '').toLowerCase())
  );

  const solarCategories = categories.filter(cat =>
    ['solar', 'solar_solutions','solar-solutions'].includes(String(cat.type || '').toLowerCase())
  );

  const handleCategoryClick = (categorySlug) => {
    setOpenDropdown(null);
    setHoveredCategory(null);
    navigate(`/category/${categorySlug}`);
  };

  const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
    setOpenDropdown(null);
    setHoveredCategory(null);
    navigate(`/category/${categorySlug}#${subcategorySlug}`);
  };

  const handleCategoryHover = (categorySlug) => {
    setHoveredCategory(categorySlug);
    loadSubcategories(categorySlug);
  };

  const renderMegaDropdown = (dropdownCategories, isOpen) => {
    if (!isOpen) return null;
    
    return (
      <div className={styles.megaDropdown}>
        <div className={styles.multilevelContainer}>
          {dropdownCategories.map(cat => (
            <div
              key={cat.id}
              className={`${styles.categoryItem} ${hoveredCategory === cat.slug ? styles.categoryItemHovered : ''}`}
              onMouseEnter={() => handleCategoryHover(cat.slug)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                className={styles.dropdownItem}
                onClick={() => handleCategoryClick(cat.slug)}
              >
                <span>{cat.name}</span>
                {subcategoriesMap[cat.slug] && subcategoriesMap[cat.slug].length > 0 && (
                  <FaChevronDown className={styles.chevronIcon} />
                )}
              </button>
              
              {hoveredCategory === cat.slug && subcategoriesMap[cat.slug] && subcategoriesMap[cat.slug].length > 0 && (
                <div className={styles.subcategoryDropdown}>
                  <div className={styles.subcategoryHeader}>
                    {cat.name} Categories
                  </div>
                  <div className={styles.subcategoryGrid}>
                    {subcategoriesMap[cat.slug].map(sub => (
                      <button
                        key={sub.id}
                        className={styles.subcategoryItem}
                        onClick={() => handleSubcategoryClick(cat.slug, sub.slug)}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <span>
            <FaMapMarkerAlt style={{ marginRight: 6 }} />
            Shelter house, Dai dai Road, South B, Ground Floor Apartment 4F31 Nairobi
          </span>
          <span>
            <FaPhoneAlt style={{ marginRight: 6 }} />
            0721247356 / 0117320000
          </span>
          <span>
            <FaEnvelope style={{ marginRight: 6 }} />
            info@edgesystems.co.ke
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <div>
          <img src={CompanyLogo} alt="Edge Systems Logo" className={styles.logo} />
        </div>
        
        <div className={styles.headerActions}>
          <div className={`${styles.dropdownContainer} ${styles.headerDropdownContainer}`} ref={allCategoriesRef}>
            <button
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'all' ? null : 'all')}
            >
              All Categories
              <FaChevronDown className={styles.headerChevron} />
            </button>
            {renderMegaDropdown(categories, openDropdown === 'all')}
          </div>
          
          <SearchBar />
          
          <button 
            onClick={() => setCartOpen(true)} 
            className={styles.cartButton}
          >
            🛒
            {cartItems.length > 0 && (
              <span className={styles.cartBadge}>{cartItems.length}</span>
            )}
          </button>
        </div>

        <div>
          <Link to="/login" className={styles.loginLink}>
            👤 Login
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li><Link to="/" className={styles.navLink}>Home</Link></li>
          
          <li ref={fireRef} className={styles.dropdownContainer}>
            <button
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'fire' ? null : 'fire')}
            >
              Fire Safety Products & Services
              <FaChevronDown className={styles.navChevron} />
            </button>
            {renderMegaDropdown(fireCategories, openDropdown === 'fire')}
          </li>
          
          <li ref={ictRef} className={styles.dropdownContainer}>
            <button
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'ict' ? null : 'ict')}
            >
              ICT/Telecommunication Products & Services
              <FaChevronDown className={styles.navChevron} />
            </button>
            {renderMegaDropdown(ictCategories, openDropdown === 'ict')}
          </li>

          <li ref={solarRef} className={styles.dropdownContainer}>
            <button
              className={styles.dropdownButton}
              onClick={() => setOpenDropdown(openDropdown === 'solar' ? null : 'solar')}
            >
              Solar Power Solutions
              <FaChevronDown className={styles.navChevron} />
            </button>
            {renderMegaDropdown(solarCategories, openDropdown === 'solar')}
          </li>
          
          <li><Link to="/contact" className={styles.navLink}>Contact Us</Link></li>
        </ul>
      </nav>

      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </header>
  );
};

export default Header;