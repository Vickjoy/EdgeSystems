import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import CompanyLogo from '../assets/Company_logo.webp';
import styles from './Header.module.css';
import { fetchCategories, fetchSubcategories } from '../utils/api';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaChevronDown, FaBars, FaTimes, FaChevronRight } from "react-icons/fa";

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState(null);
  const navigate = useNavigate();
  const fireRef = useRef();
  const ictRef = useRef();
  const solarRef = useRef();
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
        solarRef.current && !solarRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
        setHoveredCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest(`.${styles.mobileMenu}`) && !e.target.closest(`.${styles.hamburgerButton}`)) {
        setMobileMenuOpen(false);
        setMobileExpandedCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const fireCategories = categories.filter(cat =>
    ['fire_safety','fire','fire-safety','firesafety'].includes(String(cat.type || '').toLowerCase())
  );

  const ictCategories = categories.filter(cat =>
    ['ict','telecom','telecommunication'].includes(String(cat.type || '').toLowerCase())
  );

  const solarCategories = categories.filter(cat =>
    ['solar', 'solar_solutions','solar-solutions'].includes(String(cat.type || '').toLowerCase())
  );

  // Updated: Dropdown closes after selection
  const handleDropdownToggle = (dropdownName) => {
    const isCurrentlyOpen = openDropdown === dropdownName;
    setOpenDropdown(isCurrentlyOpen ? null : dropdownName);
    setHoveredCategory(null);
  };

  const handleCategoryClick = (categorySlug) => {
    // Close dropdown after selection
    setOpenDropdown(null);
    setHoveredCategory(null);
    setMobileMenuOpen(false);
    setMobileExpandedCategory(null);
    navigate(`/category/${categorySlug}`);
  };

  // Updated: Navigate to specific subcategory instead of just category
  const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
    // Close dropdown after selection
    setOpenDropdown(null);
    setHoveredCategory(null);
    setMobileMenuOpen(false);
    setMobileExpandedCategory(null);
    // Navigate directly to the specific subcategory
    navigate(`/category/${categorySlug}`, { state: { selectedSubcategory: subcategorySlug } });
  };

  const handleCategoryHover = (categorySlug) => {
    setHoveredCategory(categorySlug);
    loadSubcategories(categorySlug);
  };

  const handleMobileCategoryClick = (categoryType) => {
    if (mobileExpandedCategory === categoryType) {
      setMobileExpandedCategory(null);
    } else {
      setMobileExpandedCategory(categoryType);
      // Load subcategories for all categories of this type
      const categoryList = categoryType === 'fire' ? fireCategories : 
                          categoryType === 'ict' ? ictCategories : 
                          categoryType === 'solar' ? solarCategories : [];
      categoryList.forEach(cat => loadSubcategories(cat.slug));
    }
  };

  const renderDesktopMegaDropdown = (dropdownCategories, isOpen) => {
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

  const renderMobileCategorySection = (categoryList, categoryType, title) => (
    <div key={categoryType} className={styles.mobileCategorySection}>
      <button
        className={`${styles.mobileCategoryButton} ${mobileExpandedCategory === categoryType ? styles.expanded : ''}`}
        onClick={() => handleMobileCategoryClick(categoryType)}
      >
        <span>{title}</span>
        <FaChevronRight className={`${styles.mobileChevron} ${mobileExpandedCategory === categoryType ? styles.rotated : ''}`} />
      </button>
      
      {mobileExpandedCategory === categoryType && (
        <div className={styles.mobileSubcategoryContainer}>
          {categoryList.map(cat => (
            <div key={cat.id} className={styles.mobileCategoryGroup}>
              <button
                className={styles.mobileCategoryName}
                onClick={() => handleCategoryClick(cat.slug)}
              >
                {cat.name}
              </button>
              
              {subcategoriesMap[cat.slug] && subcategoriesMap[cat.slug].length > 0 && (
                <div className={styles.mobileSubcategoryList}>
                  {subcategoriesMap[cat.slug].map(sub => (
                    <button
                      key={sub.id}
                      className={styles.mobileSubcategoryItem}
                      onClick={() => handleSubcategoryClick(cat.slug, sub.slug)}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className={styles.header}>
      {/* Mobile Header Layout */}
      <div className={styles.mobileHeaderLayout}>
        {/* Top Bar - Mobile */}
        <div className={styles.mobileTopBar}>
          <div className={styles.mobileTopBarContent}>
            <div className={styles.contactInfo}>
              <span className={styles.contactItem}>
                <FaMapMarkerAlt />
                Shelter house, Dai dai Road, South B, Nairobi
              </span>
              <span className={styles.contactItem}>
                <FaPhoneAlt />
                0721247356 / 0117320000
              </span>
              <span className={styles.contactItem}>
                <FaEnvelope />
                info@edgesystems.co.ke
              </span>
            </div>
          </div>
        </div>

        {/* Search and Actions Row - Mobile */}
        <div className={styles.mobileSearchRow}>
          <button 
            className={styles.mobileHamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={styles.mobileSearchContainer}>
            <SearchBar />
          </div>

          <div className={styles.mobileActions}>
            <button 
              onClick={() => setCartOpen(true)} 
              className={styles.mobileCartButton}
            >
              🛒
              {cartItems.length > 0 && (
                <span className={styles.cartBadge}>{cartItems.length}</span>
              )}
            </button>

            <Link to="/login" className={styles.mobileLoginLink}>
              👤
            </Link>
          </div>
        </div>

        {/* Logo Row - Mobile */}
        <div className={styles.mobileLogoRow}>
          <img src={CompanyLogo} alt="Edge Systems Logo" className={styles.mobileLogo} />
        </div>
      </div>

      {/* Desktop Header Layout (unchanged) */}
      <div className={styles.desktopHeaderLayout}>
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
          <div className={styles.logoContainer}>
            <img src={CompanyLogo} alt="Edge Systems Logo" className={styles.logo} />
          </div>
          
          <div className={styles.headerActions}>
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

          <div className={styles.headerRight}>
            <Link to="/login" className={styles.loginLink}>
              👤 Login
            </Link>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li><Link to="/" className={styles.navLink}>Home</Link></li>
            
            <li ref={fireRef} className={styles.dropdownContainer}>
              <button
                className={styles.dropdownButton}
                onClick={() => handleDropdownToggle('fire')}
              >
                Fire Safety Products & Services
                <FaChevronDown className={styles.navChevron} />
              </button>
              {renderDesktopMegaDropdown(fireCategories, openDropdown === 'fire')}
            </li>
            
            <li ref={ictRef} className={styles.dropdownContainer}>
              <button
                className={styles.dropdownButton}
                onClick={() => handleDropdownToggle('ict')}
              >
                ICT/Telecommunication Products & Services
                <FaChevronDown className={styles.navChevron} />
              </button>
              {renderDesktopMegaDropdown(ictCategories, openDropdown === 'ict')}
            </li>

            <li ref={solarRef} className={styles.dropdownContainer}>
              <button
                className={styles.dropdownButton}
                onClick={() => handleDropdownToggle('solar')}
              >
                Solar Power Solutions
                <FaChevronDown className={styles.navChevron} />
              </button>
              {renderDesktopMegaDropdown(solarCategories, openDropdown === 'solar')}
            </li>
            
            <li><Link to="/contact" className={styles.navLink}>Contact Us</Link></li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className={styles.mobileOverlay} />}

      {/* Mobile Menu Sidebar */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <h3>Menu</h3>
          <button 
            className={styles.mobileMenuClose}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className={styles.mobileMenuContent}>
          <Link 
            to="/" 
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          {renderMobileCategorySection(fireCategories, 'fire', 'Fire Safety Products & Services')}
          {renderMobileCategorySection(ictCategories, 'ict', 'ICT/Telecommunication Products & Services')}
          {renderMobileCategorySection(solarCategories, 'solar', 'Solar Power Solutions')}
          
          <Link 
            to="/contact" 
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>

      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </header>
  );
};

export default Header;