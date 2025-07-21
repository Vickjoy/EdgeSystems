import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const OrderSummary = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  // Quantity change handler for dropdown
  const handleQuantitySelect = (item, newQty) => {
    if (newQty < 1) return;
    removeFromCart(item.id);
    addToCart({ ...item, quantity: newQty });
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Order Summary', path: '/order-summary' }]} />
      <section style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(96,150,180,0.08)', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ color: '#6096B4', fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>Order Summary</h2>
          <button
            style={{ background: '#1DCD9F', color: 'white', fontWeight: 700, padding: '0.5rem 1.5rem', borderRadius: 25, border: 'none', fontSize: 16, cursor: 'pointer' }}
            onClick={() => navigate('/category/addressable-fire-alarm-systems')}
          >
            Continue Shopping
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr style={{ background: '#f5f7fa' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6096B4' }}>Image</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#6096B4' }}>Product Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', color: '#6096B4' }}>Price</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', color: '#6096B4' }}>Quantity</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', color: '#6096B4' }}>Total</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', color: '#6096B4' }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>Your cart is empty.</td>
                </tr>
              ) : (
                cartItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <img
                        src={
                          item.image
                            ? (typeof item.image === 'object' && item.image instanceof File)
                              ? URL.createObjectURL(item.image)
                              : (typeof item.image === 'string' && (item.image.startsWith('data:') || item.image.startsWith('blob:')))
                                ? item.image
                                : (item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`)
                            : '/placeholder.png'
                        }
                        alt={item.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, background: '#f5f5f5' }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#6096B4' }}>{item.name || `Product #${item.id}`}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#1DCD9F', fontWeight: 500 }}>KES {item.price.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span style={{ fontWeight: 600, marginRight: 8 }}>{item.quantity || 1}</span>
                      <select
                        value={item.quantity || 1}
                        onChange={e => handleQuantitySelect(item, parseInt(e.target.value))}
                        style={{ padding: '0.2rem 0.5rem', borderRadius: 4, border: '1px solid #ccc', fontWeight: 600 }}
                      >
                        {[...Array(20).keys()].map(i => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>
                      KES {(item.price * (item.quantity || 1)).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 22, cursor: 'pointer' }} title="Remove">×</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 18, color: '#6096B4', marginBottom: 16 }}>
          Subtotal: KES {subtotal.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            style={{ background: '#93BFCF', color: 'white', fontWeight: 700, padding: '0.7rem 2.5rem', borderRadius: 25, border: 'none', fontSize: 17, cursor: 'pointer' }}
            onClick={() => navigate('/checkout')}
            disabled={cartItems.length === 0}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default OrderSummary; 