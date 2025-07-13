import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaTiktok } from 'react-icons/fa';
import CompanyLogo from '../assets/Company_logo.webp';

const Footer = () => {
  return (
    <footer className="bg-custom-black text-white grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
      {/* Left Column */}
      <div>
        <img src={CompanyLogo} alt="Edge Systems Logo" className="w-32 h-auto mb-4" />
        <p className="mb-4">
          At Edge Systems Ltd, we provide reliable communication and security solutions, specializing in unified systems like Nortel, Alcatel-Lucent, and Avaya. We offer structured cabling, VoIP, wireless access, CCTV/IP cameras, and fire alarm systems, supporting businesses from small offices to large campuses. Our goal is to keep your networks connected and secure with smart, dependable technology.
        </p>
        <div className="flex space-x-4">
          <a href="https://www.linkedin.com " target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <FaLinkedin className="w-6 h-6" />
          </a>
          <a href="https://www.facebook.com " target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <FaFacebook className="w-6 h-6" />
          </a>
          <a href="https://www.instagram.com " target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <FaInstagram className="w-6 h-6" />
          </a>
          <a href="https://twitter.com " target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <FaTwitter className="w-6 h-6" />
          </a>
          <a href="https://www.tiktok.com " target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <FaTiktok className="w-6 h-6" />
          </a>
        </div>
      </div>
      {/* Middle Column */}
      <div>
        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><Link to="/" className="text-white hover:text-gray-300">Home</Link></li>
          <li><Link to="/about" className="text-white hover:text-gray-300">About Us</Link></li>
          <li><Link to="/contact" className="text-white hover:text-gray-300">Contact Us</Link></li>
        </ul>
      </div>
      {/* Right Column */}
      <div>
        <h3 className="text-lg font-bold mb-4">Contact Info</h3>
        <div className="mb-2">
          <span>📍 Address: Nairobi, Kenya</span>
        </div>
        <div className="mb-2">
          <span>☎️ Phone: +254 700 000000</span>
        </div>
        <div className="mb-2">
          <span>📧 Email: info@edgesystems.co.ke</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;