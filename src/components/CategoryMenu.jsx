import React, { useEffect, useState } from 'react';
import styles from './CategoryMenu.module.css';
import { fetchCategories } from '../utils/api';

const CategoryMenu = ({ onChange, value }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setCategories([]);
      }
    };
    getCategories();
  }, []);

  return (
    <select className={styles.select} onChange={onChange} value={value || ''}>
      <option value="">All Categories</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  );
};

export default CategoryMenu;