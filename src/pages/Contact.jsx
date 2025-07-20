import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './Contact.module.css';
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaMapMarkerAlt, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Contact Us', path: '/contact' }]} />
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
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FaInstagram /></a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FaFacebook /></a>
                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FaTiktok /></a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FaLinkedin /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FaTwitter /></a>
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