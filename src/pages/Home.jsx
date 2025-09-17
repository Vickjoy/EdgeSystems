import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import EatonLogo from '../assets/Eatonn.webp';
import AlcatelLogo from '../assets/Alcatel.webp';
import AvayaLogo from '../assets/Avaya.webp';
import CiscoLogo from '../assets/Cisco.webp';
import SiemonLogo from '../assets/Siemon.webp';
import UbiquitiLogo from '../assets/Ubiquiti.webp';
import GiganetLogo from '../assets/giganet.jpeg';
import HikvisionLogo from '../assets/hikvision.png';
import PanelImage from '../assets/FireSafety.jpg';
import TelephoneImage from '../assets/telephony.jpg';

// Import service images
import FireAlarmImage from '../assets/FireAlarm.jpeg';
import SolarImage from '../assets/Solar.jpeg';
import VoIPImage from '../assets/VoIP.jpeg';
import IPImage from '../assets/IP.jpeg';
import StructuredCablingImage from '../assets/StructuredCabling.jpeg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { image: PanelImage, text: 'Protect Your Business with Fire Safety Systems', link: '/category/addressable-fire-alarm-detection-systems' },
    { image: TelephoneImage, text: 'Smart VoIP & Telephony for Modern Businesses', link: '/category/communication' },
   
  ];

const services = [
  {
    id: 1,
    image: FireAlarmImage,
    title: 'Fire Alarm & Detection',
    description: 'Fire safety systems with smoke detectors, heat sensors, and panels. Ensure fast detection, real-time alerts, regulatory compliance, and secure operations.'
  },
  {
    id: 2,
    image: StructuredCablingImage,
    title: 'Structured Cabling',
    description: 'Fiber optics, Cat6/Cat6a cabling, and management systems. Enable seamless communication, high-speed transmission, scalability, and reduced downtime for businesses.'
  },
  {
    id: 3,
    image: IPImage,
    title: 'CCTV/IP Camera',
    description: 'HD IP cameras with night vision, motion detection, and cloud storage. Provide continuous monitoring, analytics, and asset protection around-the-clock.'
  },
  {
    id: 4,
    image: VoIPImage,
    title: 'VoIP & Telephony',
    description: 'VoIP systems with call routing, conferencing, voicemail-to-email, and mobile integration. Improve collaboration, cut costs, and scale communication efficiently.'
  },
  {
    id: 5,
    image: SolarImage,
    title: 'Solar Energy & Solutions',
    description: 'Solar panels, batteries, and inverters delivering renewable power. Reduce energy costs, achieve independence, and support long-term sustainability goals.'
  }
];


  const whyChoosePoints = [
    'Authorized Eaton Distributor - Certified partnership with globally trusted brands',
    'Quality Products - We deliver only premium solutions that meet the highest industry standards',
    'Top Brands - Our partners are world leaders in technology and innovation',
    'Certified Technicians - Professional installation and support services guaranteed',
    'Competitive Pricing - Best value solutions without compromising on quality',
    'Industry Experience - Over a decade of expertise in telecommunications and security'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Extended from 4000ms to 6000ms (6 seconds)
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
            {services.map((service) => (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceImageWrapper}>
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className={styles.serviceImage}
                  />
                </div>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyChooseSection}>
        <div className={styles.whyChooseContainer}>
          <h2 className={styles.whyChooseTitle}>Why Choose Us?</h2>
          <div className={styles.whyChooseList}>
            {whyChoosePoints.map((point, index) => (
              <div key={index} className={styles.whyChooseItem}>
                <span className={styles.bulletIcon}>✦</span>
                <span className={styles.whyChooseText}>{point}</span>
              </div>
            ))}
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
            <img src={GiganetLogo} alt="Giganet" className={styles.partnerLogo} />
            <img src={HikvisionLogo} alt="Hikvision" className={styles.partnerLogo} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;