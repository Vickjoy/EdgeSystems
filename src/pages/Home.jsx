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

// Import new hero images (PNG with transparent backgrounds)
import FireImage from '../assets/Fire.png';
import UbiquitiProductImage from '../assets/ubiquiti.png';
import CiscoProductImage from '../assets/Cisco.png';
import CablingImage from '../assets/structuredcabling.jpg';

// Import service images
import FireAlarmImage from '../assets/FireAlarm.jpeg';
import SolarImage from '../assets/Solar.jpeg';
import VoIPImage from '../assets/VoIP.jpeg';
import IPImage from '../assets/IP.jpeg';
import StructuredCablingImage from '../assets/StructuredCabling.jpeg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const slides = [
    {
      id: 1,
      subtitle: 'Protect What Matters Most',
      title: 'Advanced Fire Alarm & Detection Systems',
      description: 'Reliable fire panels, detectors, and alarms designed for fast detection, instant alerts, and full safety control ensuring complete fire protection and compliance.',
      image: FireImage,
      link: '/category/addressable-fire-alarm-detection-systems',
      bgClass: 'heroSlide1'
    },
    {
      id: 2,
      subtitle: 'Power Your Digital Infrastructure',
      title: 'Enterprise Networking Solutions',
      description: 'High-performance access points, routers, and switches built for secure, scalable, and reliable connectivity. Designed to support seamless communication and business continuity.',
      images: [UbiquitiProductImage, CiscoProductImage],
      link: '/category/networking-solutions',
      bgClass: 'heroSlide2'
    },
    {
      id: 3,
      subtitle: 'Built for Performance & Reliability',
      title: 'Structured Cabling Infrastructure',
      description: 'Certified Cat6, Cat6a, and fiber optic cabling systems engineered for maximum speed, stability, and scalability ensuring your network is future-ready and dependable.',
      image: CablingImage,
      link: '/category/structured-cabling',
      bgClass: 'heroSlide3'
    }
  ];

  const services = [
    {
      id: 1,
      image: FireAlarmImage,
      title: 'Fire Alarm & Detection',
      description: 'Fire safety systems with smoke detectors, heat sensors, and panels. Ensure fast detection, real-time alerts, regulatory compliance, and secure operations.',
      link: '/category/addressable-fire-alarm-detection-systems'
    },
    {
      id: 2,
      image: StructuredCablingImage,
      title: 'Structured Cabling',
      description: 'Fiber optics, Cat6/Cat6a cabling, and management systems. Enable seamless communication, high-speed transmission, scalability, and reduced downtime for businesses.',
      link: '/category/giganet-products'
    },
    {
      id: 3,
      image: IPImage,
      title: 'CCTV/IP Camera',
      description: 'HD IP cameras with night vision, motion detection, and cloud storage. Provide continuous monitoring, analytics, and asset protection around-the-clock.',
      link: '/category/hikvision'
    },
    {
      id: 4,
      image: VoIPImage,
      title: 'VoIP & Telephony',
      description: 'VoIP systems with call routing, conferencing, voicemail-to-email, and mobile integration. Improve collaboration, cut costs, and scale communication efficiently.',
      link: '/category/addressable-fire-alarm-detection-systems'
    },
    {
      id: 5,
      image: SolarImage,
      title: 'Solar Energy & Solutions',
      description: 'Solar panels, batteries, and inverters delivering renewable power. Reduce energy costs, achieve independence, and support long-term sustainability goals.',
      link: '/category/solar-power-solutions'
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

  // Auto slide transition with smooth animation
  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  const handleSlideChange = (index) => {
    if (index !== currentSlide && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 400);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Banner - New Modern Design */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          {/* Left Content */}
          <div className={styles.heroContent}>
            <p className={styles.heroSubtitle}>{currentSlideData.subtitle}</p>
            <h1 className={styles.heroTitle}>{currentSlideData.title}</h1>
            <p className={styles.heroDescription}>{currentSlideData.description}</p>
            
            <div className={styles.heroButtons}>
              <button
                className={styles.heroButton}
                onClick={() => (window.location.href = currentSlideData.link)}
              >
                Explore Products
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ width: '20px', height: '20px' }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </button>
              
              <button className={styles.heroButtonSecondary}>
                Learn More
              </button>
            </div>

            {/* Navigation Dots */}
            <div className={styles.heroNavigation}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`${styles.heroDot} ${
                    index === currentSlide ? styles.heroDotActive : ''
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Image Side */}
          <div className={styles.heroImageContainer}>
            <div className={`${styles.heroImageWrapper} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
              {currentSlideData.images ? (
                // Multiple images for network solutions slide
                <div className={styles.heroImagesGrid}>
                  {currentSlideData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${currentSlideData.title} - ${idx + 1}`}
                      className={styles.heroImage}
                    />
                  ))}
                </div>
              ) : (
                // Single image
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className={styles.heroImage}
                />
              )}
            </div>
            
            {/* Floating decorative shapes */}
            <div className={styles.floatingShape}></div>
            <div className={styles.floatingShape}></div>
          </div>
        </div>
      </section>

      {/* Partner Brands - Auto Scrolling */}
      <section className={styles.partnersSection}>
        <div className={styles.partnersContainer}>
          <h2 className={styles.partnersTitle}>Partner Brands</h2>
          <div className={styles.sliderWrapper}>
            <div className={styles.sliderTrack}>
              {[
                { logo: AlcatelLogo, name: 'Alcatel', link: 'https://www.al-enterprise.com/' },
                { logo: AvayaLogo, name: 'Avaya', link: 'https://www.avaya.com/' },
                { logo: CiscoLogo, name: 'Cisco', link: 'https://www.cisco.com/' },
                { logo: EatonLogo, name: 'Eaton', link: 'https://www.eaton.com/' },
                { logo: SiemonLogo, name: 'Siemon', link: 'https://www.siemon.com/' },
                { logo: UbiquitiLogo, name: 'Ubiquiti', link: 'https://www.ui.com/' },
                { logo: GiganetLogo, name: 'Giganet', link: 'https://www.giganet.com.eg/' },
                { logo: HikvisionLogo, name: 'Hikvision', link: 'https://www.hikvision.com/' },
              ].concat([
                { logo: AlcatelLogo, name: 'Alcatel', link: 'https://www.al-enterprise.com/' },
                { logo: AvayaLogo, name: 'Avaya', link: 'https://www.avaya.com/' },
                { logo: CiscoLogo, name: 'Cisco', link: 'https://www.cisco.com/' },
                { logo: EatonLogo, name: 'Eaton', link: 'https://www.eaton.com/' },
                { logo: SiemonLogo, name: 'Siemon', link: 'https://www.siemon.com/' },
                { logo: UbiquitiLogo, name: 'Ubiquiti', link: 'https://www.ui.com/' },
                { logo: GiganetLogo, name: 'Giganet', link: 'https://www.giganet.com.eg/' },
                { logo: HikvisionLogo, name: 'Hikvision', link: 'https://www.hikvision.com/' },
              ]).map((brand, index) => (
                <a 
                  key={index} 
                  href={brand.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.partnerLogoLink}
                >
                  <img src={brand.logo} alt={brand.name} className={styles.partnerLogo} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesContainer}>
          <h2 className={styles.servicesTitle}>Our Services</h2>
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <a 
                key={service.id} 
                href={service.link}
                className={styles.serviceCard}
              >
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
              </a>
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
    </div>
  );
};

export default Home;