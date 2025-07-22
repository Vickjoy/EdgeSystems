import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const defaultValues = {
  name: '',
  price: '',
  description: '',
  image: '',
  features: '',
  specifications: '',
  documentation: '',
  status: 'in_stock',
  subcategory: '',
};

const fieldStyle = { marginBottom: 16 };

const ProductForm = ({ initialValues = {}, onSubmit, onCancel, loading, subcategories = [], categories = [] }) => {
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const { token } = useAuth();

  // If no category is selected, default to the first available category
  React.useEffect(() => {
    if (!form.category && categories.length > 0) {
      setForm(f => ({ ...f, category: String(categories[0].id) }));
    }
  }, [categories]);

  // Filter subcategories for the selected category (compare as strings)
  const selectedCategoryId = form.category || (initialValues.category ? String(initialValues.category.id || initialValues.category) : '');
  const filteredSubcategories = selectedCategoryId
    ? subcategories.filter(
        sub => sub && String(sub.category.id) === String(selectedCategoryId)
      )
    : [];

  // Remove category and subcategory fields from the form UI
  // Use subcategory from initialValues (passed from parent/modal) for product creation

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setForm(f => ({ ...f, image: files[0] }));
      setImageFileName(files[0].name);
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    console.log('ProductForm handleSubmit called', form, initialValues);
    if (!form.name || !form.price) {
      setError('Name and price are required.');
      return;
    }
    // Use subcategory from initialValues
    const submitForm = { ...form, subcategory: initialValues.subcategory || form.subcategory };
    onSubmit(submitForm, token);
  };

  return (
    <form onSubmit={handleSubmit} noValidate action="#" style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 480, margin: '0 auto', color: '#111', maxHeight: '80vh', overflowY: 'auto', boxSizing: 'border-box' }}>
      <h3 style={{ marginBottom: 16, textAlign: 'center', color: '#111' }}>{initialValues.id ? 'Edit Product' : 'Add Product'}</h3>
      <div style={fieldStyle}>
        <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', color: '#111' }} placeholder="Product Name" />
      </div>
      <div style={fieldStyle}>
        <input name="price" type="number" value={form.price} onChange={handleChange} required style={{ width: '100%', color: '#111' }} placeholder="Price (KES)" />
      </div>
      <div style={fieldStyle}>
        <textarea name="description" value={form.description} onChange={handleChange} style={{ width: '100%', color: '#111' }} rows={2} placeholder="Description" />
      </div>
      <div style={fieldStyle}>
        <textarea name="features" value={form.features} onChange={handleChange} style={{ width: '100%', color: '#111' }} rows={2} placeholder="Features" />
      </div>
      <div style={fieldStyle}>
        <textarea name="specifications" value={form.specifications} onChange={handleChange} style={{ width: '100%', color: '#111' }} rows={2} placeholder="Specifications" />
      </div>
      <div style={fieldStyle}>
        <input name="documentation" value={form.documentation} onChange={handleChange} style={{ width: '100%', color: '#111' }} placeholder="Documentation" />
      </div>
      <div style={fieldStyle}>
        <select name="status" value={form.status} onChange={handleChange} style={{ width: '100%', color: '#111' }}>
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
      <div style={fieldStyle}>
        <input name="image" type="file" accept="image/*" onChange={handleChange} style={{ width: '100%' }} />
        {imageFileName && <div style={{ fontSize: 13, color: '#6096B4', marginTop: 4 }}>{imageFileName}</div>}
        {imagePreview && <img src={imagePreview} alt="preview" style={{ width: 80, marginTop: 8, borderRadius: 4 }} />}
        {!imagePreview && form.image && typeof form.image === 'string' && (
          <img src={`http://127.0.0.1:8000${form.image}`} alt="preview" style={{ width: 80, marginTop: 8, borderRadius: 4 }} />
        )}
      </div>
      {error && <div style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
        <button type="submit" disabled={loading} style={{ background: '#1DCD9F', color: '#fff', padding: '0.5rem 1.5rem', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Saving...' : (initialValues.id ? 'Update' : 'Add')}
        </button>
        <button type="button" onClick={onCancel} style={{ background: '#eee', color: '#333', padding: '0.5rem 1.5rem', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 