import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './About.module.css';

const About = () => {
  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'About Us', path: '/about' }]} />
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>About Us</h2>
          <div className={styles.content}>
            <p className={styles.paragraph}>
              At Edge Systems Ltd, we provide reliable communication and security solutions, specializing in unified systems like Nortel, Alcatel-Lucent, and Avaya. We offer structured cabling, VoIP, wireless access, CCTV/IP cameras, and fire alarm systems, supporting businesses from small offices to large campuses. Our goal is to keep your networks connected and secure with smart, dependable technology.
            </p>
            <div className={styles.missionVisionGrid}>
              <div className={styles.missionCard}>
                <h3 className={styles.missionTitle}>Our Mission</h3>
                <p className={styles.missionText}>
                  To deliver high-quality communication and security solutions that meet the unique needs of our clients, ensuring their networks are reliable, efficient, and secure.
                </p>
              </div>
              <div className={styles.visionCard}>
                <h3 className={styles.visionTitle}>Our Vision</h3>
                <p className={styles.visionText}>
                  To be the leading provider of innovative communication and security solutions, trusted by businesses worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;