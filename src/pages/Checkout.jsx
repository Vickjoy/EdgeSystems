import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

const Checkout = () => {
  return (
    <div>
      <Header />

      <Breadcrumbs crumbs={[
        { label: 'Home', path: '/' },
        { label: 'Checkout', path: '/checkout' }
      ]} />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>
          <form className="max-w-lg mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" id="address" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" id="city" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input type="text" id="state" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP Code</label>
              <input type="text" id="zip" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="card" className="block text-sm font-medium text-gray-700">Credit Card Number</label>
              <input type="text" id="card" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input type="text" id="expiry" placeholder="MM/YY" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
              <input type="text" id="cvv" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Place Order
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;