import React, { useState } from 'react';

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
    if (!form.name || !form.price || !form.subcategory) {
      setError('Name, price, and subcategory are required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 420, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 16, textAlign: 'center' }}>{initialValues.id ? 'Edit Product' : 'Add Product'}</h3>
      <div style={fieldStyle}>
        <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%' }} placeholder="Product Name" />
      </div>
      <div style={fieldStyle}>
        <input name="price" type="number" value={form.price} onChange={handleChange} required style={{ width: '100%' }} placeholder="Price (KES)" />
      </div>
      <div style={fieldStyle}>
        <textarea name="description" value={form.description} onChange={handleChange} style={{ width: '100%' }} rows={2} placeholder="Description" />
      </div>
      <div style={fieldStyle}>
        <textarea name="features" value={form.features} onChange={handleChange} style={{ width: '100%' }} rows={2} placeholder="Features" />
      </div>
      <div style={fieldStyle}>
        <textarea name="specifications" value={form.specifications} onChange={handleChange} style={{ width: '100%' }} rows={2} placeholder="Specifications" />
      </div>
      <div style={fieldStyle}>
        <input name="documentation" value={form.documentation} onChange={handleChange} style={{ width: '100%' }} placeholder="Documentation" />
      </div>
      <div style={fieldStyle}>
        <select name="status" value={form.status} onChange={handleChange} style={{ width: '100%' }}>
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
      <div style={fieldStyle}>
        <select name="subcategory" value={form.subcategory} onChange={handleChange} required style={{ width: '100%' }}>
          <option value="" disabled>Select Subcategory</option>
          {Array.isArray(subcategories) && subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
      </div>
      <div style={fieldStyle}>
        <input name="image" type="file" accept="image/*" onChange={handleChange} style={{ width: '100%' }} />
        {/* Show file name if a new file is selected */}
        {imageFileName && <div style={{ fontSize: 13, color: '#6096B4', marginTop: 4 }}>{imageFileName}</div>}
        {/* Show preview for new upload */}
        {imagePreview && <img src={imagePreview} alt="preview" style={{ width: 80, marginTop: 8, borderRadius: 4 }} />}
        {/* Show preview for existing image (edit mode) */}
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