import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  fetchCategories, fetchSubcategories, createCategory, updateCategory, deleteCategory,
  fetchProductsBySubcategory, createProduct, updateProduct, deleteProduct, createSubcategory
} from '../utils/api';
import ProductForm from '../components/ProductForm';
import CompanyLogo from '../assets/Company_logo.webp';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [fireCategories, setFireCategories] = useState([]);
  const [ictCategories, setIctCategories] = useState([]);
  const [fireSubcategories, setFireSubcategories] = useState({}); // {catId: [subcat, ...]}
  const [ictSubcategories, setIctSubcategories] = useState({});
  const [productsByCategory, setProductsByCategory] = useState({}); // {catId: [product, ...]}
  const [activeSection, setActiveSection] = useState('fire');
  const [expandedCategory, setExpandedCategory] = useState(null); // category id
  const [productModal, setProductModal] = useState({ open: false, subcategory: null });
  const [loading, setLoading] = useState(false);
  // Add state for modals
  const [categoryModal, setCategoryModal] = useState({ open: false, type: 'fire' });
  const [subcategoryModal, setSubcategoryModal] = useState({ open: false, category: null });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  // Load categories and subcategories on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const cats = await fetchCategories(token);
        const fire = cats.filter(cat => cat.type === 'fire');
        const ict = cats.filter(cat => cat.type === 'ict');
        setFireCategories(fire);
        setIctCategories(ict);
        // Fetch subcategories for each category
        const fireSubs = {};
        for (const cat of fire) {
          const subs = await fetchSubcategories(cat.slug, token);
          fireSubs[cat.id] = subs;
        }
        setFireSubcategories(fireSubs);
        const ictSubs = {};
        for (const cat of ict) {
          const subs = await fetchSubcategories(cat.slug, token);
          ictSubs[cat.id] = subs;
        }
        setIctSubcategories(ictSubs);
      } catch (e) {
        setFireCategories([]);
        setIctCategories([]);
        setFireSubcategories({});
        setIctSubcategories({});
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  // Handler for expanding/collapsing a category
  const handleCategoryClick = (catId) => {
    setExpandedCategory(expandedCategory === catId ? null : catId);
  };

  // Handler for opening the Add Product modal for a subcategory
  const handleShowAddProductModal = (subcategory) => {
    setProductModal({ open: true, subcategory: subcategory.slug });
  };

  // Handler for adding a product
  const handleAddProduct = async (form) => {
    if (!productModal.subcategory) return;
    // Attach subcategory slug to form
    const submitForm = { ...form, subcategory: productModal.subcategory };
    await createProduct(submitForm, token);
    setProductModal({ open: false, subcategory: null });
  };

  // Add placeholder handlers for edit/delete
  const handleEditCategory = (cat) => { alert(`Edit category: ${cat.name}`); };
  const handleDeleteCategory = (cat) => { if(window.confirm(`Delete category: ${cat.name}?`)){} };
  const handleEditSubcategory = (sub) => { alert(`Edit subcategory: ${sub.name}`); };
  const handleDeleteSubcategory = (sub) => { if(window.confirm(`Delete subcategory: ${sub.name}?`)){} };
  // Add placeholder handlers for product edit/delete
  const handleEditProduct = (product) => { alert(`Edit product: ${product.name}`); };
  const handleDeleteProduct = (product) => { if(window.confirm(`Delete product: ${product.name}?`)){} };

  // Add handlers for add category/subcategory
  const handleShowAddCategoryModal = (type) => {
    setCategoryModal({ open: true, type });
    setNewCategoryName('');
  };
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await createCategory(newCategoryName, token, categoryModal.type);
    setCategoryModal({ open: false, type: 'fire' });
  };
  const handleShowAddSubcategoryModal = (category) => {
    setSubcategoryModal({ open: true, category });
    setNewSubcategoryName('');
  };
  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim()) return;
    await createSubcategory(subcategoryModal.category.slug, newSubcategoryName, token);
    setSubcategoryModal({ open: false, category: null });
  };

  // Handler for logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Render categories and subcategories for a section
  const renderSection = (categories, subcategories, type) => (
    <div>
      <div className={styles.buttonRow}>
        <button type="button" className={`${styles.adminButton} adminButton`} onClick={() => handleShowAddCategoryModal(type)}>+ Add Category</button>
      </div>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        categories.map(cat => (
          <div key={cat.id} className={styles.categoryContainer}>
            <div className={styles.categoryHeader} onClick={() => handleCategoryClick(cat.id)}>
              <h3>{cat.name}</h3>
              <div className={styles.buttonRow}>
                <button type="button" className={`${styles.editButton} editButton`} onClick={e => {e.stopPropagation(); handleEditCategory(cat);}}>Edit</button>
                <button type="button" className={`${styles.deleteButton} deleteButton`} onClick={e => {e.stopPropagation(); handleDeleteCategory(cat);}}>Delete</button>
              </div>
            </div>
            {expandedCategory === cat.id && (
              <div className={styles.subcategoryList}>
                <h4>Subcategories:</h4>
                <div className={styles.buttonRow}>
                  <button type="button" className={`${styles.adminButton} adminButton`} onClick={() => handleShowAddSubcategoryModal(cat)}>+ Add Subcategory</button>
                </div>
                <ul>
                  {(subcategories[cat.id] || []).map(sub => (
                    <li key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{sub.name}</span>
                      <div className={styles.buttonRow}>
                        <button type="button" className={`${styles.adminButton} adminButton`} onClick={() => handleShowAddProductModal(sub)}>+ Add Product</button>
                        <button type="button" className={`${styles.editButton} editButton`} onClick={() => handleEditSubcategory(sub)}>Edit</button>
                        <button type="button" className={`${styles.deleteButton} deleteButton`} onClick={() => handleDeleteSubcategory(sub)}>Delete</button>
                      </div>
                      {sub.products && sub.products.length > 0 && (
                        <ul>
                          {sub.products.map(product => (
                            <li key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span>{product.name}</span>
                              <div className={styles.buttonRow}>
                                <button type="button" className={`${styles.editButton} editButton`} onClick={() => handleEditProduct(product)}>Edit</button>
                                <button type="button" className={`${styles.deleteButton} deleteButton`} onClick={() => handleDeleteProduct(product)}>Delete</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.adminHeader}>
        <img src={CompanyLogo} alt="Company Logo" className={styles.adminLogo} />
        <h2 className={styles.adminTitle}>Admin Dashboard</h2>
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
      <div className={styles.sectionSwitcher}>
        <button type="button" onClick={() => setActiveSection('fire')} className={activeSection === 'fire' ? styles.active : ''}>Fire Safety</button>
        <button type="button" onClick={() => setActiveSection('ict')} className={activeSection === 'ict' ? styles.active : ''}>ICT/Telecommunication</button>
      </div>
      <main className={styles.adminMainContent}>
        {loading ? <p>Loading...</p> : (
          activeSection === 'fire'
            ? renderSection(fireCategories, fireSubcategories, 'fire')
            : renderSection(ictCategories, ictSubcategories, 'ict')
        )}
      </main>
      {/* Product Modal */}
      {productModal.open && (
        <div className={styles.adminModal}>
          <div className={styles.adminModalContent}>
            <ProductForm
              initialValues={{ subcategory: productModal.subcategory }}
              onSubmit={handleAddProduct}
              onCancel={() => setProductModal({ open: false, subcategory: null })}
              loading={loading}
            />
          </div>
        </div>
      )}
      {categoryModal.open && (
        <div className={styles.adminModal}>
          <div className={styles.adminModalContent}>
            <h3>Add Category</h3>
            <input
              className={styles.adminFormInput}
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
            />
            <div className={styles.buttonRow}>
              <button type="button" className={`${styles.adminButton} adminButton`} onClick={handleAddCategory}>Add</button>
              <button type="button" className={`${styles.deleteButton} deleteButton`} onClick={() => setCategoryModal({ open: false, type: 'fire' })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {subcategoryModal.open && (
        <div className={styles.adminModal}>
          <div className={styles.adminModalContent}>
            <h3>Add Subcategory</h3>
            <input
              className={styles.adminFormInput}
              type="text"
              placeholder="Subcategory name"
              value={newSubcategoryName}
              onChange={e => setNewSubcategoryName(e.target.value)}
            />
            <div className={styles.buttonRow}>
              <button type="button" className={`${styles.adminButton} adminButton`} onClick={handleAddSubcategory}>Add</button>
              <button type="button" className={`${styles.deleteButton} deleteButton`} onClick={() => setSubcategoryModal({ open: false, category: null })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 