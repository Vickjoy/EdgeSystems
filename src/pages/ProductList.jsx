import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

const ProductList = ({ match }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = match.params.category;

  useEffect(() => {
    // Fetch products from the backend
    fetch(`/api/products?category=${category}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [category]);

  return (
    <div>
      <Header />
      <Breadcrumbs crumbs={[
        { label: 'Home', path: '/' },
        { label: 'Fire Safety', path: '/fire-safety' },
        { label: category.charAt(0).toUpperCase() + category.slice(1), path: `/fire-safety/${category}` }
      ]} />
      <section className="py-12 bg-dark-blue text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Fire Safety Products</h2>
          {/* Category Filter Section */}
          <select className="border border-gray-300 rounded px-2 py-1 mb-4">
            <option>All Categories</option>
            <option>Fire Alarm & Detection</option>
            <option>Fire Suppression</option>
            <option>Fire Prevention</option>
            <option>Accessories</option>
            <option>Networking</option>
            <option>Cabling</option>
            <option>Communication</option>
          </select>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductList;