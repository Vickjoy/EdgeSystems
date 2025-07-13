import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  return (
    <div className={styles.container}>
      <input type="text" placeholder="Search for product..." className={styles.input} />
      <button className={styles.button}>
        🔍
      </button>
    </div>
  );
};

export default SearchBar;