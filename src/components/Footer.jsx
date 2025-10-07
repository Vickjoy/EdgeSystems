import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CompanyLogo from '../assets/Company_logo.webp';
import InstagramIcon from '../assets/Instagram.png';
import LinkedInIcon from '../assets/LinkedIn.png';
import TiktokIcon from '../assets/Tiktok.png';
import FacebookIcon from '../assets/Facebook.png';
import WhatsAppIcon from '../assets/whatsapp.png';
import styles from './Footer.module.css';

const Footer = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch latest 3 blogs for footer
    fetch('http://127.0.0.1:8000/api/blogs/footer/')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching footer blogs:', err);
        setLoading(false);
      });
  }, []);

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path, prepend the Django backend URL
    if (imageUrl.startsWith('/')) {
      return `http://127.0.0.1:8000${imageUrl}`;
    }
    
    return imageUrl;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      {/* First Column - Company Info */}
      <div>
        <img src={CompanyLogo} alt="Edge Systems Logo" className={styles.logo} />
        <p className="mb-4">
          Edge Systems Ltd is a trusted provider of integrated safety and technology solutions in Kenya. 
          Our core expertise lies in fire safety systems, including advanced alarm and detection 
          solutions that protect lives and property. We also deliver structured cabling, 
          VoIP and telecommunication systems, CCTV/IP surveillance, and renewable solar energy solutions. 
          From small offices to large enterprises, our mission is to keep environments safe, 
          connected, and energy-efficient with reliable, future-ready technology.
        </p>
        <div className={styles.socialLinks}>
          <a 
            href="https://www.linkedin.com/in/edge-systems-903b32222?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={LinkedInIcon} alt="LinkedIn" className={styles.socialIcon} />
          </a>
          <a 
            href="https://www.facebook.com/edgesystemslimited" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={FacebookIcon} alt="Facebook" className={styles.socialIcon} />
          </a>
          <a 
            href="https://www.instagram.com/edge_systems.co.ke?utm_source=qr&igsh=aHpldnhnZnRmYjM3" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={InstagramIcon} alt="Instagram" className={styles.socialIcon} />
          </a>
          <a 
            href="https://www.tiktok.com/@edgesystems6?_t=ZM-8yCr3l8iIwn&_r=1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={TiktokIcon} alt="TikTok" className={styles.socialIcon} />
          </a>
          <a 
            href="https://wa.me/254117320000" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
          >
            <img src={WhatsAppIcon} alt="WhatsApp" className={styles.socialIcon} />
          </a>
        </div>
      </div>

      {/* Second Column - Contact Info */}
      <div>
        <h3 className={styles.sectionTitle}>Contact Info</h3>
        <ul className={styles.contactInfo}>
          <li className={styles.contactItem}>
            <span>📍 Shelter House, Dai Dai Road, South B, 4th Floor Apartment 4F31, Nairobi 43322-00100, Kenya</span>
          </li>
          <li className={styles.contactItem}>
            <span>☎️ +254721247356 / +254117320000</span>
          </li>
          <li className={styles.contactItem}>
            <span>📧 info@edgesystems.co.ke</span>
          </li>
        </ul>
      </div>

      {/* Third Column - Quick Links */}
      <div>
        <h3 className={styles.sectionTitle}>Quick Links</h3>
        <ul className={styles.quickLinks} role="navigation" aria-label="Quick Links">
          <li>
            <Link 
              to="/" 
              className={styles.quickLink} 
              tabIndex={0}
              onClick={scrollToTop}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={styles.quickLink} 
              tabIndex={0}
              onClick={scrollToTop}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={styles.quickLink} 
              tabIndex={0}
              onClick={scrollToTop}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Fourth Column - From Our Blog */}
      <div>
        <h3 className={styles.sectionTitle}>From Our Blog</h3>
        {loading ? (
          <p className={styles.blogLoading}>Loading blogs...</p>
        ) : blogs.length > 0 ? (
          <ul className={styles.blogList}>
            {blogs.map((blog) => (
              <li key={blog.id} className={styles.blogItem}>
                <Link 
                  to={`/blog/${blog.slug}`} 
                  className={styles.blogLink}
                  onClick={scrollToTop}
                >
                  <div className={styles.blogContent}>
                    {blog.image && (
                      <img 
                        src={getFullImageUrl(blog.image)} 
                        alt={blog.title}
                        className={styles.blogThumbnail}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <span className={styles.blogTitle}>{blog.title}</span>
                  </div>
                </Link>
                {blog.source_name && (
                  <small className={styles.blogSource}>
                    Source: <a 
                      href={blog.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.sourceLink}
                    >
                      {blog.source_name}
                    </a>
                  </small>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noBlog}>No blogs available</p>
        )}
      </div>
    </footer>
  );
};

export default Footer;