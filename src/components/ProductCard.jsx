import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="border border-gray-300 rounded overflow-hidden shadow-md">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="px-6 py-4">
        <h3 className="font-bold text-xl mb-2">{product.name}</h3>
        <p className="text-gray-700 text-base mb-2">${product.price}</p>
        <Link to={`/product/${product.id}`} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;