import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

const About = () => {
  return (
    <div>
      <Header />
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'About Us', path: '/about' }]} />
      <section className="py-12 bg-dark-blue text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">About Us</h2>
          <p className="mb-8">
            At Edge Systems Ltd, we provide reliable communication and security solutions, specializing in unified systems like Nortel, Alcatel-Lucent, and Avaya. We offer structured cabling, VoIP, wireless access, CCTV/IP cameras, and fire alarm systems, supporting businesses from small offices to large campuses. Our goal is to keep your networks connected and secure with smart, dependable technology.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p>
                To deliver high-quality communication and security solutions that meet the unique needs of our clients, ensuring their networks are reliable, efficient, and secure.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p>
                To be the leading provider of innovative communication and security solutions, trusted by businesses worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;