import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './Contact.module.css';
import NairobiImg from '../assets/Nairobi.jpg';
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';

const heroStyle = {
  width: '100%',
  height: '260px',
  backgroundImage: `url(${NairobiImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '2rem',
};
const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(24, 28, 32, 0.45)',
  zIndex: 1,
};
const heroTextStyle = {
  position: 'relative',
  zIndex: 2,
  color: '#fff',
  fontSize: '2.5rem',
  fontWeight: 800,
  textShadow: '0 4px 24px rgba(0,0,0,0.25)',
  letterSpacing: '0.04em',
};

const Contact = () => {
  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Contact Us', path: '/contact' }]} />
      <div style={heroStyle}>
        <div style={overlayStyle}></div>
        <div style={heroTextStyle}>Contact Us</div>
      </div>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.headerText}>
            Visit our store or talk to us on phone, email or social media.
          </div>
          <div className={styles.spreadGrid}>
            {/* Left column: contact methods */}
            <div className={styles.leftSpread}>
              <div className={styles.contactItem}>
                <FaPhoneAlt className={styles.icon} />
                <span className={styles.contactText}>+254 0202400280, 0721247356</span>
              </div>
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.icon} />
                <span className={styles.contactText}>info@edgesystems.co.ke</span>
              </div>
              <div className={styles.contactItem}>
                <FaGlobe className={styles.icon} />
                <a href="http://www.edgesystems.co.ke" target="_blank" rel="noopener noreferrer" className={styles.contactText}>www.edgesystems.co.ke</a>
              </div>
              <div className={styles.socialRowSpread}>
                <a href="https://www.instagram.com/edge_systems.co.ke?utm_source=qr&igsh=aHpldnhnZnRmYjM3" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FaInstagram /></a>
                <a href="https://www.facebook.com/edgesystemslimited" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FaFacebook /></a>
                <a href="https://www.tiktok.com/@edgesystems6?_t=ZM-8yCr3l8iIwn&_r=1" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FaTiktok /></a>
                <a href="https://www.linkedin.com/in/edge-systems-903b32222?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FaLinkedin /></a>
              </div>
            </div>
            {/* Right column: office locations */}
            <div className={styles.rightSpread}>
              <div className={styles.officeHeader}>Office Locations</div>
              <div className={styles.officeAddress}>
                <div className={styles.officeItem}><FaMapMarkerAlt className={styles.icon} /> Shelter house, house, Dai dai Road, South B, 4th Floor Apartment 4F31 Nairobi</div>
                <div className={styles.officeItem}><FaMapMarkerAlt className={styles.icon} /> 43322-00100 Nairobi Kenya</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;