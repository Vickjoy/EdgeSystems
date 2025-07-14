import React, { useState } from 'react';

const defaultValues = {
  name: '',
  price: '',
  description: '',
  image: '',
  category: '',
};

const ProductForm = ({ initialValues = {}, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setForm(f => ({ ...f, image: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price || !form.category) {
      setError('Name, price, and category are required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 480, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 16 }}>{initialValues.id ? 'Edit Product' : 'Add Product'}</h3>
      <div style={{ marginBottom: 12 }}>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Price:</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Description:</label>
        <textarea name="description" value={form.description} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Category:</label>
        <input name="category" value={form.category} onChange={handleChange} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Image:</label>
        <input name="image" type="file" accept="image/*" onChange={handleChange} />
        {form.image && typeof form.image === 'string' && (
          <img src={`http://127.0.0.1:8000${form.image}`} alt="preview" style={{ width: 80, marginTop: 8 }} />
        )}
      </div>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 12 }}>
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