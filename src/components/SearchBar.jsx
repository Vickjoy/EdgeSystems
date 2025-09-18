import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';
import { fetchCategories } from '../utils/api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setNoResults(false);
    if (!query.trim()) return;
    setLoading(true);
    try {
      // Fetch all categories to get all products (since no search endpoint)
      const categories = await fetchCategories();
      let allProducts = [];
      for (const cat of categories) {
        const res = await fetch(`http://127.0.0.1:8000/api/categories/${cat.slug}/subcategories/`);
        const subcategories = await res.json();
        for (const sub of subcategories) {
          const prodRes = await fetch(`http://127.0.0.1:8000/api/subcategories/${sub.slug}/products/`);
          const products = await prodRes.json();
          if (Array.isArray(products)) {
            allProducts = allProducts.concat(products);
          }
        }
      }
      // Remove duplicate products by name (case-insensitive)
      const uniqueProductsNameMap = new Map();
      allProducts.forEach(p => {
        if (p && p.name) {
          const nameKey = p.name.trim().toLowerCase();
          if (!uniqueProductsNameMap.has(nameKey)) {
            uniqueProductsNameMap.set(nameKey, p);
          }
        }
      });
      const uniqueProducts = Array.from(uniqueProductsNameMap.values());
      
      // Enhanced case-insensitive search - check name, description, and features
      const searchTerm = query.toLowerCase().trim();
      const matches = uniqueProducts.filter(p => {
        if (!p.name) return false;
        
        // Search in product name
        const nameMatch = p.name.toLowerCase().includes(searchTerm);
        
        // Search in product description if available
        const descriptionMatch = p.description && 
          p.description.toLowerCase().includes(searchTerm);
        
        // Search in product features if available
        const featuresMatch = p.features && 
          p.features.toLowerCase().includes(searchTerm);
        
        // Return true if any field contains the search term
        return nameMatch || descriptionMatch || featuresMatch;
      });
      
      if (matches.length === 0) {
        setNoResults(true);
      } else if (matches.length === 1) {
        navigate(`/product/${matches[0].slug}`);
      } else {
        // Pass results to a search results page (via state or query param)
        navigate(`/search?query=${encodeURIComponent(query)}`, { state: { results: matches } });
      }
    } catch (err) {
      setError('Error searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <input
          type="text"
          placeholder="Search for product..."
          className={styles.input}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? '...' : '🔍'}
        </button>
      </form>
      {noResults && (
        <div style={{ color: 'red', marginTop: 4, fontSize: 14 }}>No results for '{query}'</div>
      )}
      {error && (
        <div style={{ color: 'red', marginTop: 4, fontSize: 14 }}>{error}</div>
      )}
    </div>
  );
};

export default SearchBar;