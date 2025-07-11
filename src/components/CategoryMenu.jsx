import React from 'react';

const CategoryMenu = () => {
  return (
    <select className="border border-gray-300 rounded px-2 py-1 mr-4">
      <option>All Categories</option>
      <option>Fire Alarm & Detection</option>
      <option>Fire Suppression</option>
      <option>Fire Prevention</option>
      <option>Accessories</option>
      <option>Networking</option>
      <option>Cabling</option>
      <option>Communication</option>
    </select>
  );
};

export default CategoryMenu;