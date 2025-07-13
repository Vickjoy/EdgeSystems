import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

const ProductDetail = ({ match }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const productId = match.params.id;

  useEffect(() => {
    // Fetch product details from the backend
    fetch(`/api/products/${productId}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching product details:', error));
  }, [productId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header />
      <Breadcrumbs crumbs={[
        { label: 'Home', path: '/' },
        { label: 'Fire Safety', path: '/fire-safety' },
        { label: 'Fire Extinguishers', path: '/fire-safety/extinguishers' },
        { label: product.name, path: `/product/${product.id}` }
      ]} />
      <section className="py-12 bg-dark-blue text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full md:w-1/2">
              <img src={product.image} alt={product.name} className="w-full h-auto" />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
              <p className="mb-4">{product.description}</p>
              <p className="text-2xl font-bold mb-4">${product.price}</p>
              <p className="mb-4">{product.availability}</p>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" id="quantity" defaultValue="1" min="1" className="border border-gray-300 rounded px-2 py-1 w-16" />
              </div>
              <button className="bg-mid-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded mb-4">
                Add to Cart
              </button>
              {/* Optional Tabs Section */}
              <div className="border-t border-gray-200">
                <div className="flex justify-center space-x-4 pt-4">
                  <button className="text-gray-600 hover:text-gray-800">Documentation</button>
                  <button className="text-gray-600 hover:text-gray-800">Specs / Features</button>
                  <button className="text-gray-600 hover:text-gray-800">Related Products</button>
                </div>
                <div className="pt-4">
                  {/* Content for selected tab */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;