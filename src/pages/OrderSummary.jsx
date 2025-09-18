import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from './OrderSummary.module.css';

const OrderSummary = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  // Quantity change handler for dropdown
  const handleQuantitySelect = (item, newQty) => {
    if (newQty < 1) return;
    removeFromCart(item.id);
    addToCart({ ...item, quantity: newQty });
  };

  // Price calculations
  const totalBeforeTax = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const taxRate = 0.16; // 16%
  const taxAmount = totalBeforeTax * taxRate;
  const totalWithTax = totalBeforeTax + taxAmount;

  const handleNext = () => {
    navigate('/checkout');
    // Removed clearCart() to keep cart content throughout
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Order Summary', path: '/order-summary' }]} />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Order Summary
          </h2>
          <button
            className={styles.continueButton}
            onClick={() => navigate('/category/addressable-fire-alarm-detection-systems')}
          >
            Continue Shopping
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={`${styles.tableHeaderCell} ${styles.left}`}>
                  Image
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.left}`}>
                  Product Name
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.center}`}>
                  Quantity
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.right}`}>
                  Price
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.center}`}>
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyCell}>
                    Your cart is empty.
                  </td>
                </tr>
              ) : (
                cartItems.map((item, index) => (
                  <tr key={item.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
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
                        className={styles.productImage}
                      />
                    </td>
                    <td className={`${styles.tableCell} ${styles.productName}`}>
                      {item.name || `Product #${item.id}`}
                    </td>
                    <td className={`${styles.tableCell} ${styles.quantityCell}`}>
                      <div className={styles.quantityContainer}>
                        <select
                          value={item.quantity || 1}
                          onChange={e => handleQuantitySelect(item, parseInt(e.target.value))}
                          className={styles.quantitySelect}
                        >
                          {[...Array(20).keys()].map(i => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className={`${styles.tableCell} ${styles.priceCell}`}>
                      <div className={styles.priceContainer}>
                        <div className={styles.priceBeforeTax}>
                          KES {(Number(item.price) * item.quantity).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={styles.taxInfo}>
                          Tax (16%): KES {(Number(item.price) * item.quantity * 0.16).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={styles.totalPrice}>
                          Total: KES {(Number(item.price) * item.quantity * 1.16).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </td>
                    <td className={`${styles.tableCell} ${styles.center}`}>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className={styles.removeButton}
                        title="Remove"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Price Summary Table */}
        {cartItems.length > 0 && (
          <div className={styles.priceSummaryContainer}>
            <table className={styles.priceSummaryTable}>
              <tbody>
                <tr className={styles.priceSummaryRow}>
                  <td className={styles.priceSummaryCell}>
                    Total before tax:
                  </td>
                  <td className={styles.priceSummaryValue}>
                    KES {totalBeforeTax.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className={styles.priceSummaryRow}>
                  <td className={styles.priceSummaryCell}>
                    Total VAT (16%):
                  </td>
                  <td className={styles.priceSummaryValue}>
                    KES {taxAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className={`${styles.priceSummaryRow} ${styles.totalRow}`}>
                  <td className={`${styles.priceSummaryCell} ${styles.totalCell}`}>
                    Total:
                  </td>
                  <td className={`${styles.priceSummaryValue} ${styles.totalValue}`}>
                    KES {totalWithTax.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.nextButtonContainer}>
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={cartItems.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;