import React from 'react';
import { Link } from 'react-router-dom'; // Import Link here

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
      {/* Left Column */}
      <div>
        <img src="/path/to/logo.png" alt="Edge Systems Logo" className="w-32 h-auto mb-4" />
        <p className="mb-4">
          At Edge Systems Ltd, we provide reliable communication and security solutions, specializing in unified systems like Nortel, Alcatel-Lucent, and Avaya. We offer structured cabling, VoIP, wireless access, CCTV/IP cameras, and fire alarm systems, supporting businesses from small offices to large campuses. Our goal is to keep your networks connected and secure with smart, dependable technology.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-white hover:text-gray-300">LinkedIn</a>
          <a href="#" className="text-white hover:text-gray-300">Facebook</a>
          <a href="#" className="text-white hover:text-gray-300">Instagram</a>
          <a href="#" className="text-white hover:text-gray-300">X (Twitter)</a>
        </div>
      </div>

      {/* Middle Column */}
      <div>
        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><Link to="/" className="text-white hover:text-gray-300">Home</Link></li> {/* Use Link instead of a plain anchor tag */}
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