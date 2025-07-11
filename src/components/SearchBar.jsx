import React from 'react';

const SearchBar = () => {
  return (
    <div className="relative">
      <input type="text" placeholder="Search for product..." className="border border-gray-300 rounded px-2 py-1 pr-8 w-64" />
      <button className="absolute right-0 top-0 bottom-0 px-2 py-1 bg-gray-300 rounded-r">
        🔍
      </button>
    </div>
  );
};

export default SearchBar;