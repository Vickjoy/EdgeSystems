import React from 'react';
import styles from './CategoryMenu.module.css';

const CategoryMenu = () => {
  return (
    <select className={styles.select}>
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