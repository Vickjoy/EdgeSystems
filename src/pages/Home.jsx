import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

const Home = () => {
  return (
    <div>
      <Header />

      {/* Hero Banner */}
      <section className="bg-cover bg-center h-screen relative">
        <img src="/path/to/hero-banner.jpg" alt="Hero Banner" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Secure your business with Fire Safety Systems</h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Explore Products
          </button>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <img src="/path/to/fire-alarm-icon.png" alt="Fire Alarm & Detection" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Fire Alarm & Detection</h3>
              <p>Protect your property with advanced fire alarm systems.</p>
            </div>
            <div className="text-center">
              <img src="/path/to/cabling-icon.png" alt="Structured Cabling" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Structured Cabling</h3>
              <p>Reliable network infrastructure for your business needs.</p>
            </div>
            <div className="text-center">
              <img src="/path/to/cctv-icon.png" alt="CCTV/IP Cameras" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">CCTV/IP Cameras</h3>
              <p>Surveillance solutions to keep your premises safe.</p>
            </div>
            <div className="text-center">
              <img src="/path/to/voip-icon.png" alt="VoIP & Telephony" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">VoIP & Telephony</h3>
              <p>Efficient communication systems for your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us? */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <img src="/path/to/eaton-logo.png" alt="Authorized Eaton Distributor" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Authorized Eaton Distributor</h3>
              <p>Trusted partner for reliable products.</p>
            </div>
            <div className="text-center">
              <img src="/path/to/quality-icon.png" alt="Quality Products" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Quality Products</h3>
              <p>High-quality products for your business.</p>
            </div>
            <div className="text-center">
              <img src="/path/to/top-brands-icon.png" alt="Top Brands" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Top Brands</h3>
              <p>Leading brands in the industry.</p>
            </div>
            <div className="text-center">
              <img src="/path/to/certified-icon.png" alt="Certified Technicians" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Certified Technicians</h3>
              <p>Expert installation and maintenance services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Brands Carousel */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Partner Brands</h2>
          <div className="flex justify-center space-x-8">
            <img src="/path/to/eaton-logo.png" alt="Eaton" className="w-24 h-auto" />
            <img src="/path/to/cisco-logo.png" alt="Cisco" className="w-24 h-auto" />
            <img src="/path/to/avaya-logo.png" alt="Avaya" className="w-24 h-auto" />
            <img src="/path/to/alcatel-logo.png" alt="Alcatel-Lucent" className="w-24 h-auto" />
            <img src="/path/to/ubiquiti-logo.png" alt="Ubiquiti" className="w-24 h-auto" />
            <img src="/path/to/siemon-logo.png" alt="Siemon" className="w-24 h-auto" />
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Stay Updated</h2>
          <form className="max-w-lg mx-auto">
            <div className="flex">
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 rounded-l focus:outline-none" />
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r">Subscribe</button>
            </div>
            <p className="mt-2 text-center">Thank you for subscribing!</p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;