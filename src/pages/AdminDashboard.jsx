import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  fetchCategories, fetchSubcategories, createCategory, updateCategory, deleteCategory,
  createSubcategory, updateSubcategory, deleteSubcategory,
  fetchProductsBySubcategory, createProduct, updateProduct, deleteProduct
} from '../utils/api';
import ProductForm from '../components/ProductForm';
import CompanyLogo from '../assets/Company_logo.webp';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Category State
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModal, setCategoryModal] = useState({ type: null, value: '', id: null });

  // Subcategory State
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategoryModal, setSubcategoryModal] = useState({ type: null, value: '', id: null });

  // Product State
  const [products, setProducts] = useState([]);
  const [productModal, setProductModal] = useState({ type: null, initialValues: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories(token);
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [token]);

  // Load subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      setSelectedSubcategory(null);
      return;
    }
    const loadSubcategories = async () => {
      setLoading(true);
      try {
        const data = await fetchSubcategories(selectedCategory.slug, token);
        setSubcategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadSubcategories();
  }, [selectedCategory, token]);

  // Load products when subcategory changes
  useEffect(() => {
    if (!selectedSubcategory) {
      setProducts([]);
      return;
    }
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProductsBySubcategory(selectedSubcategory.id, 1, 100, token);
        setProducts(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedSubcategory, token]);

  // Category CRUD
  const handleCategoryAction = async (action, id, value) => {
    setError('');
    setLoading(true);
    try {
      if (action === 'add') {
        await createCategory(value, token);
      } else if (action === 'edit') {
        await updateCategory(id, value, token);
      } else if (action === 'delete') {
        await deleteCategory(id, token);
        setSelectedCategory(null);
      }
      const data = await fetchCategories(token);
      setCategories(Array.isArray(data) ? data : []);
      window.dispatchEvent(new Event('categoriesUpdated'));
    } catch (e) {
      setError('Failed to perform category action.');
    } finally {
      setLoading(false);
      setCategoryModal({ type: null, value: '', id: null });
    }
  };

  // Subcategory CRUD
  const handleSubcategoryAction = async (action, id, value) => {
    setError('');
    setLoading(true);
    try {
      if (action === 'add') {
        await createSubcategory(selectedCategory.slug, value, token);
      } else if (action === 'edit') {
        await updateSubcategory(selectedCategory.slug, id, value, token);
      } else if (action === 'delete') {
        await deleteSubcategory(selectedCategory.slug, id, token);
      }
      const data = await fetchSubcategories(selectedCategory.slug, token);
      setSubcategories(Array.isArray(data) ? data : []);
      window.dispatchEvent(new Event('subcategoriesUpdated'));
    } catch (e) {
      setError('Failed to perform subcategory action.');
    } finally {
      setLoading(false);
      setSubcategoryModal({ type: null, value: '', id: null });
    }
  };

  // Product CRUD
  const handleProductAction = async (action, form, id) => {
    setError('');
    setLoading(true);
    try {
      if (action === 'add') {
        await createProduct(form, token);
      } else if (action === 'edit') {
        await updateProduct(id, form, token);
      } else if (action === 'delete') {
        await deleteProduct(id, token);
      }
      if (selectedSubcategory) {
        const data = await fetchProductsBySubcategory(selectedSubcategory.id, 1, 100, token);
        setProducts(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
      }
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (e) {
      setError('Failed to perform product action.');
    } finally {
      setLoading(false);
      setProductModal({ type: null, initialValues: null });
      setDeletingId(null);
    }
  };

  if (!user?.is_staff && !user?.is_superuser) {
    return <div className={styles.unauthorized}>Unauthorized</div>;
  }

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.adminHeader}>
        <img src={CompanyLogo} alt="Company Logo" className={styles.adminLogo} />
        <h2 className={styles.adminTitle}>Admin Dashboard</h2>
      </div>
      <div className={styles.adminMain}>
        {/* Sidebar: Categories & Subcategories */}
        <aside className={styles.adminSidebar}>
          <h3 className={styles.adminSectionTitle}>Categories</h3>
          <button className={styles.adminButton} onClick={() => setCategoryModal({ type: 'add-category', value: '', id: null })}>+ Add Category</button>
          <ul className={styles.adminList}>
            {categories.map(cat => (
              <li key={cat.id} className={styles.adminListItem + (selectedCategory?.id === cat.id ? ' ' + styles.selected : '')}>
                <div className={styles.adminListItemRow}>
                  <span className={styles.adminListItemName + (selectedCategory?.id === cat.id ? ' ' + styles.selected : '')} onClick={() => { setSelectedCategory(cat); setSelectedSubcategory(null); }}>{cat.name}</span>
                  <button className={styles.adminButton} onClick={() => setCategoryModal({ type: 'edit-category', value: cat.name, id: cat.id })}>Edit</button>
                  <button className={styles.adminButton + ' ' + styles.danger} onClick={() => setCategoryModal({ type: 'delete-category', value: cat.name, id: cat.id })}>Delete</button>
                </div>
                {/* Subcategories for this category */}
                {selectedCategory?.id === cat.id && (
                  <div>
                    <h4 className={styles.adminSectionTitle}>Subcategories</h4>
                    <button className={styles.adminButton} onClick={() => setSubcategoryModal({ type: 'add-subcategory', value: '', id: null })}>+ Add Subcategory</button>
                    <ul className={styles.adminSubList}>
                      {subcategories.map(sub => (
                        <li key={sub.id} className={styles.adminListItemRow}>
                          <span className={styles.adminListItemName + (selectedSubcategory?.id === sub.id ? ' ' + styles.selected : '')} onClick={() => setSelectedSubcategory(sub)}>{sub.name}</span>
                          <button className={styles.adminButton} onClick={() => setSubcategoryModal({ type: 'edit-subcategory', value: sub.name, id: sub.id })}>Edit</button>
                          <button className={styles.adminButton + ' ' + styles.danger} onClick={() => setSubcategoryModal({ type: 'delete-subcategory', value: sub.name, id: sub.id })}>Delete</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </aside>
        {/* Main Content: Products */}
        <main className={styles.adminMainContent}>
          <div className={styles.adminProductHeader}>
            <h3 className={styles.adminProductTitle}>Products</h3>
            {selectedSubcategory && (
              <button className={styles.adminButton} onClick={() => setProductModal({ type: 'add', initialValues: { subcategory: selectedSubcategory.id } })}>+ Add Product</button>
            )}
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : selectedSubcategory ? (
            <table className={styles.adminProductTable}>
              <thead>
                <tr className={styles.adminProductTableHeader}>
                  <th className={styles.adminProductTableHeaderCell}>Image</th>
                  <th className={styles.adminProductTableHeaderCell}>Name</th>
                  <th className={styles.adminProductTableHeaderCell}>Price</th>
                  <th className={styles.adminProductTableHeaderCell}>Status</th>
                  <th className={styles.adminProductTableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className={styles.adminProductTableRow}>
                    <td className={styles.adminProductTableCell}>
                      {product.image ? (
                        <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} className={styles.adminProductTableImage} />
                      ) : (
                        <span className={styles.adminProductTableNoImage}>No image</span>
                      )}
                    </td>
                    <td className={styles.adminProductTableCell + ' ' + styles.adminProductNameCell}>{product.name}</td>
                    <td className={styles.adminProductTableCell}>KES {(product.price * 1.3).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
                    <td className={styles.adminProductTableCell}>{product.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}</td>
                    <td className={styles.adminProductTableCell}>
                      <button
                        className={styles.adminButton}
                        onClick={() => setProductModal({ type: 'edit', initialValues: product })}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.adminButton + ' ' + styles.danger}
                        onClick={() => { if (window.confirm('Are you sure you want to delete this product?')) { setDeletingId(product.id); handleProductAction('delete', null, product.id); } }}
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.noProductsMessage}>Select a subcategory to view products.</div>
          )}
        </main>
      </div>
      {/* Category Modal */}
      {categoryModal.type && (
        <div className={styles.adminModal}>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (categoryModal.type === 'add-category') handleCategoryAction('add', null, categoryModal.value);
              if (categoryModal.type === 'edit-category') handleCategoryAction('edit', categoryModal.id, categoryModal.value);
              if (categoryModal.type === 'delete-category') handleCategoryAction('delete', categoryModal.id);
            }}
            className={styles.adminModalContent}
          >
            <h3 className={styles.adminSectionTitle}>
              {categoryModal.type === 'add-category' && 'Add Category'}
              {categoryModal.type === 'edit-category' && 'Edit Category'}
              {categoryModal.type === 'delete-category' && 'Delete Category'}
            </h3>
            {(categoryModal.type === 'add-category' || categoryModal.type === 'edit-category') && (
              <input
                type="text"
                value={categoryModal.value}
                onChange={e => setCategoryModal(m => ({ ...m, value: e.target.value }))}
                placeholder="Name"
                required
                className={styles.adminFormInput}
              />
            )}
            {categoryModal.type && categoryModal.type.startsWith('delete') && (
              <div>Are you sure you want to delete "{categoryModal.value}"?</div>
            )}
            <div className={styles.adminModalButtons}>
              <button type="submit" className={styles.adminButton}>{categoryModal.type && categoryModal.type.startsWith('delete') ? 'Delete' : 'Save'}</button>
              <button type="button" onClick={() => setCategoryModal({ type: null, value: '', id: null })} className={styles.adminButton}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Subcategory Modal */}
      {subcategoryModal.type && (
        <div className={styles.adminModal}>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (subcategoryModal.type === 'add-subcategory') handleSubcategoryAction('add', null, subcategoryModal.value);
              if (subcategoryModal.type === 'edit-subcategory') handleSubcategoryAction('edit', subcategoryModal.id, subcategoryModal.value);
              if (subcategoryModal.type === 'delete-subcategory') handleSubcategoryAction('delete', subcategoryModal.id);
            }}
            className={styles.adminModalContent}
          >
            <h3 className={styles.adminSectionTitle}>
              {subcategoryModal.type === 'add-subcategory' && 'Add Subcategory'}
              {subcategoryModal.type === 'edit-subcategory' && 'Edit Subcategory'}
              {subcategoryModal.type === 'delete-subcategory' && 'Delete Subcategory'}
            </h3>
            {(subcategoryModal.type === 'add-subcategory' || subcategoryModal.type === 'edit-subcategory') && (
              <input
                type="text"
                value={subcategoryModal.value}
                onChange={e => setSubcategoryModal(m => ({ ...m, value: e.target.value }))}
                placeholder="Name"
                required
                className={styles.adminFormInput}
              />
            )}
            {subcategoryModal.type && subcategoryModal.type.startsWith('delete') && (
              <div>Are you sure you want to delete "{subcategoryModal.value}"?</div>
            )}
            <div className={styles.adminModalButtons}>
              <button type="submit" className={styles.adminButton}>{subcategoryModal.type && subcategoryModal.type.startsWith('delete') ? 'Delete' : 'Save'}</button>
              <button type="button" onClick={() => setSubcategoryModal({ type: null, value: '', id: null })} className={styles.adminButton}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Product Modal */}
      {productModal.type && (
        <div className={styles.adminModal}>
          <div className={styles.adminModalContent}>
            <ProductForm
              initialValues={productModal.initialValues}
              onSubmit={form => handleProductAction(productModal.type, form, productModal.initialValues?.id)}
              onCancel={() => setProductModal({ type: null, initialValues: null })}
              loading={loading}
              subcategories={subcategories}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 