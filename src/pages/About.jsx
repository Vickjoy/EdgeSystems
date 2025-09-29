import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './About.module.css';
import AboutOffice from '../assets/AboutOffice.jpeg';
import AboutCamera from '../assets/AboutCamera.jpeg';
import AboutFire from '../assets/AboutFire.jpeg';
import AboutCabling from '../assets/AboutCabling.jpeg';

const About = () => {
  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'About Us', path: '/about' }]} />
      
      <section className={styles.section}>
        <div className={styles.container}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <h1 className={styles.mainTitle}>About <span className={styles.highlight}>Edge Systems Ltd</span></h1>
            <p className={styles.tagline}>Kenya's Trusted Partner in Fire Safety & Integrated Solutions</p>
          </div>

          {/* Who We Are */}
          <div className={styles.whoWeAre}>
            <h2 className={styles.sectionTitle}>Who We Are</h2>
            <div className={styles.introGrid}>
              <div className={styles.introText}>
                <p className={styles.paragraph}>
                  <span className={styles.companyName}>Edge Systems Ltd</span> is a leading Kenyan company specializing primarily in <strong>fire safety systems and solutions</strong>. Our core strength lies in delivering comprehensive fire alarm and detection systems, including advanced fire panels, detectors, alarms, and compliance-driven fire protection services.
                </p>
                <p className={styles.paragraph}>
                  We play a vital role in safeguarding businesses, institutions, and properties across Kenya by providing end-to-end fire safety solutions — from initial design and professional installation to ongoing maintenance and emergency response readiness.
                </p>
              </div>
              <div className={styles.introImage}>
                <img src={AboutOffice} alt="Edge Systems Office" className={styles.image} />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className={styles.missionVisionSection}>
            <div className={styles.missionCard}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>🎯</span>
              </div>
              <h3 className={styles.cardTitle}>Our Mission</h3>
              <p className={styles.cardText}>
                To save lives, protect property, and create safer communities through the delivery of modern, reliable fire safety systems. We are committed to ensuring every client receives cutting-edge solutions that meet international standards and local compliance requirements.
              </p>
            </div>
            
            <div className={styles.visionCard}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>🔥</span>
              </div>
              <h3 className={styles.cardTitle}>Our Vision</h3>
              <p className={styles.cardText}>
                To be Kenya's most trusted fire safety and integrated solutions partner, recognized for our unwavering commitment to excellence, innovation, and customer-focused service across all sectors.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className={styles.valuesSection}>
            <h2 className={styles.sectionTitle}>Our Core Values</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <h4 className={styles.valueTitle}>Safety First</h4>
                <p className={styles.valueText}>Protecting lives and property is at the heart of everything we do.</p>
              </div>
              <div className={styles.valueCard}>
                <h4 className={styles.valueTitle}>Integrity</h4>
                <p className={styles.valueText}>We operate with honesty, transparency, and ethical standards.</p>
              </div>
              <div className={styles.valueCard}>
                <h4 className={styles.valueTitle}>Innovation</h4>
                <p className={styles.valueText}>We embrace cutting-edge technology and forward-thinking solutions.</p>
              </div>
              <div className={styles.valueCard}>
                <h4 className={styles.valueTitle}>Excellence</h4>
                <p className={styles.valueText}>We deliver quality workmanship and exceptional service every time.</p>
              </div>
              <div className={styles.valueCard}>
                <h4 className={styles.valueTitle}>Customer Focus</h4>
                <p className={styles.valueText}>Your safety needs and satisfaction drive our commitment.</p>
              </div>
            </div>
          </div>

          {/* Our Expertise */}
          <div className={styles.expertiseSection}>
            <h2 className={styles.sectionTitle}>Our Expertise</h2>
            <p className={styles.expertiseIntro}>
              At Edge Systems Ltd, fire safety is our primary specialization. We complement this with strategic ICT and energy solutions to create safer, smarter, and more efficient environments.
            </p>
            
            <div className={styles.expertiseGrid}>
              {/* Fire Safety - Primary */}
              <div className={styles.expertiseCardPrimary}>
                <div className={styles.expertiseImageWrapper}>
                  <img src={AboutFire} alt="Fire Safety Systems" className={styles.expertiseImage} />
                </div>
                <div className={styles.expertiseContent}>
                  <h3 className={styles.expertiseTitle}>
                    <span className={styles.badge}>Core Specialty</span>
                    Fire Safety Systems
                  </h3>
                  <ul className={styles.expertiseList}>
                    <li>Advanced Fire Alarm & Detection Systems</li>
                    <li>Fire Panels, Detectors & Sounders</li>
                    <li>Emergency Response Systems</li>
                    <li>Compliance & Safety Audits</li>
                    <li>Installation, Maintenance & Support</li>
                  </ul>
                </div>
              </div>

              {/* Supporting Solutions */}
              <div className={styles.expertiseCardSecondary}>
                <div className={styles.expertiseImageWrapper}>
                  <img src={AboutCamera} alt="CCTV Surveillance" className={styles.expertiseImage} />
                </div>
                <div className={styles.expertiseContent}>
                  <h3 className={styles.expertiseTitle}>CCTV & IP Surveillance</h3>
                  <p className={styles.expertiseDesc}>Enhanced security monitoring to complement fire safety measures.</p>
                </div>
              </div>

              <div className={styles.expertiseCardSecondary}>
                <div className={styles.expertiseImageWrapper}>
                  <img src={AboutCabling} alt="Structured Cabling" className={styles.expertiseImage} />
                </div>
                <div className={styles.expertiseContent}>
                  <h3 className={styles.expertiseTitle}>Structured Cabling & VoIP</h3>
                  <p className={styles.expertiseDesc}>Robust communication infrastructure for seamless connectivity.</p>
                </div>
              </div>
            </div>
          </div>

          {/* What Sets Us Apart */}
          <div className={styles.differentiatorSection}>
            <h2 className={styles.sectionTitle}>What Sets Us Apart</h2>
            <div className={styles.differentiatorGrid}>
              
              <div className={styles.differentiatorCard}>
                <span className={styles.differentiatorIcon}>🌍</span>
                <h4 className={styles.differentiatorTitle}>Global Partnerships</h4>
                <p className={styles.differentiatorText}>Strategic alliances with leading international fire safety technology providers.</p>
              </div>
              <div className={styles.differentiatorCard}>
                <span className={styles.differentiatorIcon}>👨‍🔧</span>
                <h4 className={styles.differentiatorTitle}>Certified Technicians</h4>
                <p className={styles.differentiatorText}>Highly trained and certified professionals ensuring quality installations.</p>
              </div>
              <div className={styles.differentiatorCard}>
                <span className={styles.differentiatorIcon}>✅</span>
                <h4 className={styles.differentiatorTitle}>Compliance Commitment</h4>
                <p className={styles.differentiatorText}>All solutions meet local regulations and international fire safety standards.</p>
              </div>
              <div className={styles.differentiatorCard}>
                <span className={styles.differentiatorIcon}>🤝</span>
                <h4 className={styles.differentiatorTitle}>Customer Trust</h4>
                <p className={styles.differentiatorText}>Building lasting relationships through reliability, transparency, and excellence.</p>
              </div>
              <div className={styles.differentiatorCard}>
                <span className={styles.differentiatorIcon}>⚡</span>
                <h4 className={styles.differentiatorTitle}>Rapid Response</h4>
                <p className={styles.differentiatorText}>24/7 support and emergency response capabilities when you need us most.</p>
              </div>
            </div>
          </div>

          {/* Closing Statement */}
          <div className={styles.closingSection}>
            <p className={styles.closingText}>
              <em>At Edge Systems Ltd, we don't just install fire safety systems — we create peace of mind. Partner with us to protect what matters most.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;