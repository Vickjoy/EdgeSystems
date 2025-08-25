import React, { useState, useEffect } from 'react';
import { FaFireExtinguisher, FaNetworkWired, FaVideo } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import styles from './Home.module.css';

import EatonLogo from '../assets/Eatonn.webp';
import AlcatelLogo from '../assets/Alcatel.webp';
import AvayaLogo from '../assets/Avaya.webp';
import CiscoLogo from '../assets/Cisco.webp';
import SiemonLogo from '../assets/Siemon.webp';
import UbiquitiLogo from '../assets/Ubiquiti.webp';

import PanelImage from '../assets/Control.jpg';
import CablingImage from '../assets/cabling.jpg';
import TelephoneImage from '../assets/telephony.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { image: PanelImage, text: 'Protect Your Business with Fire Safety Systems', link: '/category/addressable-fire-alarm-detection-systems' },
    { image: TelephoneImage, text: 'Smart VoIP & Telephony for Modern Businesses', link: '/category/communication' },
    { image: CablingImage, text: 'Structured Cabling Solutions for Seamless Connectivity', link: '/category/batteries-power-supplies-wiring' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Banner */}
      <section className={styles.heroSection}>
        <img src={slides[currentSlide].image} alt="Hero" className={styles.heroImage} />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>{slides[currentSlide].text}</h1>
          <button
            className={styles.heroButton}
            onClick={() => (window.location.href = slides[currentSlide].link)}
          >
            Explore Products
          </button>
        </div>
      </section>

      {/* Our Services */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesContainer}>
          <h2 className={styles.servicesTitle}>Our Services</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <FaFireExtinguisher className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>Fire Alarm & Detection</h3>
              <p className={styles.serviceDescription}>Protect your property with advanced fire alarm systems.</p>
            </div>
            <div className={styles.serviceCard}>
              <FaNetworkWired className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>Structured Cabling</h3>
              <p className={styles.serviceDescription}>Reliable network infrastructure for your business needs.</p>
            </div>
            <div className={styles.serviceCard}>
              <FaVideo className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>CCTV / IP Cameras</h3>
              <p className={styles.serviceDescription}>Surveillance solutions to keep your premises safe.</p>
            </div>
            <div className={styles.serviceCard}>
              <MdPhone className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>VoIP & Telephony</h3>
              <p className={styles.serviceDescription}>Efficient communication systems for your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyChooseSection}>
        <div className={styles.whyChooseContainer}>
          <h2 className={styles.whyChooseTitle}>Why Choose Us?</h2>
          <div className={styles.whyChooseGrid}>
            <div className={styles.whyChooseCard}>
              <h4 className={styles.whyChooseTitle}>Authorized Eaton Distributor</h4>
              <p className={styles.whyChooseDescription}>Certified partner with trusted brands.</p>
            </div>
            <div className={styles.whyChooseCard}>
              <h4 className={styles.whyChooseTitle}>Quality Products</h4>
              <p className={styles.whyChooseDescription}>We deliver only the best for your needs.</p>
            </div>
            <div className={styles.whyChooseCard}>
              <h4 className={styles.whyChooseTitle}>Top Brands</h4>
              <p className={styles.whyChooseDescription}>Our partners are world leaders in tech.</p>
            </div>
            <div className={styles.whyChooseCard}>
              <h4 className={styles.whyChooseTitle}>Certified Technicians</h4>
              <p className={styles.whyChooseDescription}>Professional service and support guaranteed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Brands */}
      <section className={styles.partnersSection}>
        <div className={styles.partnersContainer}>
          <h2 className={styles.partnersHeader}>Partner Brands:</h2>
          <div className={styles.partnersGrid}>
            <img src={AlcatelLogo} alt="Alcatel" className={styles.partnerLogo} />
            <img src={AvayaLogo} alt="Avaya" className={styles.partnerLogo} />
            <img src={CiscoLogo} alt="Cisco" className={styles.partnerLogo} />
            <img src={EatonLogo} alt="Eaton" className={styles.partnerLogo} />
            <img src={SiemonLogo} alt="Siemon" className={styles.partnerLogo} />
            <img src={UbiquitiLogo} alt="Ubiquiti" className={styles.partnerLogo} />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterContainer}>
          <h2 className={styles.newsletterTitle}>Stay Updated</h2>
          <form className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.newsletterInput}
            />
            <button
              type="submit"
              className={styles.newsletterButton}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
