import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

const Login = () => {
  return (
    <div>
      <Header />

      <Breadcrumbs crumbs={[
        { label: 'Home', path: '/' },
        { label: 'Login', path: '/login' }
      ]} />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
          <form className="max-w-lg mx-auto">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;