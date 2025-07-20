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

const ProductForm = ({ initialValues = {}, onSubmit, onCancel, loading, subcategories = [] }) => {
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const { token } = useAuth();

  // Build a list of unique categories from subcategories
  const categories = Array.from(
    new Map(
      (subcategories || [])
        .filter(sub => sub && sub.category)
        .map(sub => [sub.category.id || sub.category, sub.category])
    ).values()
  );

  // Determine selected category
  const selectedCategoryId = form.category || (initialValues.category ? (initialValues.category.id || initialValues.category) : '');

  // Filter subcategories for the selected category
  const filteredSubcategories = subcategories.filter(
    sub => sub && (sub.category.id === selectedCategoryId || sub.category === selectedCategoryId)
  );

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setForm(f => ({ ...f, image: files[0] }));
      setImageFileName(files[0].name);
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (name === 'category') {
      setForm(f => ({ ...f, category: value, subcategory: '', subcategoryId: '' }));
    } else if (name === 'subcategory') {
      const selected = filteredSubcategories.find(sub => sub.slug === value);
      setForm(f => ({
        ...f,
        subcategory: value, // slug
        subcategoryId: selected ? selected.id : ''
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price || !form.subcategory) {
      setError('Name, price, and subcategory are required.');
      return;
    }
    onSubmit(form, token);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 420, margin: '0 auto', color: '#111' }}>
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
        <select
          name="category"
          value={selectedCategoryId || ''}
          onChange={handleChange}
          required
          style={{ width: '100%', color: '#111' }}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id || cat} value={cat.id || cat}>{cat.name || cat}</option>
          ))}
        </select>
      </div>
      <div style={fieldStyle}>
        <select
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          required
          style={{ width: '100%', color: '#111' }}
          disabled={!selectedCategoryId}
        >
          <option value="">Select Subcategory</option>
          {filteredSubcategories.map(subcat => (
            subcat && <option key={subcat.id} value={subcat.slug}>
              {subcat.name}
            </option>
          ))}
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