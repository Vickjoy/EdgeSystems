import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaFireExtinguisher, FaNetworkWired, FaVideo } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import AlcatelLogo from '../assets/Alcatel.webp';
import AvayaLogo from '../assets/Avaya.webp';
import CiscoLogo from '../assets/Cisco.webp';
import EatonLogo from '../assets/Eatonn.webp';
import SiemonLogo from '../assets/Siemon.webp';
import UbiquitiLogo from '../assets/Ubiquiti.webp';

import PanelImage from '../assets/Control.jpg';
import CablingImage from '../assets/cabling.jpg';
import TelephoneImage from '../assets/telephony.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { image: PanelImage, text: 'Protect Your Business with Fire Safety Systems', link: '/fire-safety/alarm-detection' },
    { image: TelephoneImage, text: 'Smart VoIP & Telephony for Modern Businesses', link: '/ict/communication' },
    { image: CablingImage, text: 'Structured Cabling Solutions for Seamless Connectivity', link: '/ict/networking' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[80vh]">
        <img src={slides[currentSlide].image} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-6xl font-extrabold mb-6">{slides[currentSlide].text}</h1>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded"
            onClick={() => (window.location.href = slides[currentSlide].link)}
          >
            Explore Products
          </button>
        </div>
      </section>

      <div className="py-12"></div>

      {/* Our Services as Cards */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <FaFireExtinguisher className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Fire Alarm & Detection</h3>
              <p>Protect your property with advanced fire alarm systems.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <FaNetworkWired className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Structured Cabling</h3>
              <p>Reliable network infrastructure for your business needs.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <FaVideo className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">CCTV / IP Cameras</h3>
              <p>Surveillance solutions to keep your premises safe.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <MdPhone className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">VoIP & Telephony</h3>
              <p>Efficient communication systems for your business.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12"></div>

      {/* Why Choose Us */}
      <section className="py-12 bg-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="font-bold mb-2">Authorized Eaton Distributor</h4>
              <p>Certified partner with trusted brands.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h4 className="font-bold mb-2">Quality Products</h4>
              <p>We deliver only the best for your needs.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h4 className="font-bold mb-2">Top Brands</h4>
              <p>Our partners are world leaders in tech.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h4 className="font-bold mb-2">Certified Technicians</h4>
              <p>Professional service and support guaranteed.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12"></div>

      {/* Partner Brands */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Partner Brands</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <img src={AlcatelLogo} alt="Alcatel" className="h-16 w-auto" />
            <img src={AvayaLogo} alt="Avaya" className="h-16 w-auto" />
            <img src={CiscoLogo} alt="Cisco" className="h-16 w-auto" />
            <img src={EatonLogo} alt="Eaton" className="h-16 w-auto" />
            <img src={SiemonLogo} alt="Siemon" className="h-16 w-auto" />
            <img src={UbiquitiLogo} alt="Ubiquiti" className="h-16 w-auto" />
          </div>
        </div>
      </section>

      <div className="py-12"></div>

      {/* Newsletter */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <form className="flex justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-l border border-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-r"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
