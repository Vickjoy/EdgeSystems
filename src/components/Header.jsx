import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import CategoryMenu from './CategoryMenu';
import CompanyLogo from '../assets/Company_logo.webp';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="flex justify-center items-center py-2 px-4 md:px-8">
        <div className="flex items-center space-x-4">
          <span>☎️ +254 700 000000</span>
          <span>📧 info@edgesystems.co.ke</span>
        </div>
      </div>
      {/* Middle Bar */}
      <div className="flex justify-between items-center py-4 px-4 md:px-8">
        <div>
          <img src={CompanyLogo} alt="Edge Systems Logo" className="w-32 h-auto" />
        </div>
        <div className="flex items-center">
          <CategoryMenu />
          <SearchBar />
        </div>
        <div>
          <Link to="/login" className="text-gray-600 hover:text-gray-800 mr-4">
            👤 Login
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-gray-800">
            🛒 Cart (0)
          </Link>
        </div>
      </div>
      {/* Bottom Bar */}
      <nav className="z-50 sticky top-0 bg-white shadow-md py-2 px-4 md:px-8">
        <ul className="flex justify-center space-x-8">
          <li><Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link></li>
          <li className="relative group">
            <button className="text-gray-600 hover:text-gray-800">
              Fire Safety Products & Services
            </button>
            <ul className="absolute hidden group-hover:block w-full left-0 bg-white shadow-md rounded-b-lg">
              <li><Link to="/fire-safety/alarm-detection" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Fire Alarm & Detection</Link></li>
              <li><Link to="/fire-safety/suppression" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Fire Suppression</Link></li>
              <li><Link to="/fire-safety/prevention" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Fire Prevention</Link></li>
              <li><Link to="/fire-safety/accessories" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Accessories</Link></li>
            </ul>
          </li>
          <li className="relative group">
            <button className="text-gray-600 hover:text-gray-800">
              ICT & Telecommunication Products & Services
            </button>
            <ul className="absolute hidden group-hover:block w-full left-0 bg-white shadow-md rounded-b-lg">
              <li><Link to="/ict/networking" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Networking</Link></li>
              <li><Link to="/ict/cabling" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Cabling</Link></li>
              <li><Link to="/ict/communication" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Communication</Link></li>
            </ul>
          </li>
          <li><Link to="/about" className="text-gray-600 hover:text-gray-800">About Us</Link></li>
          <li><Link to="/contact" className="text-gray-600 hover:text-gray-800">Contact Us</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;