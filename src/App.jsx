import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/ProductList';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProductManager from './pages/AdminProductManager';
import AdminDashboard from './pages/AdminDashboard';
import AdminCategoryManager from './pages/AdminCategoryManager';
import CategoryPage from './pages/CategoryPage';

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product/edit/:id" element={<ProductDetail />} />
        <Route path="/fire-safety/:categorySlug" element={<ProductList />} />
        <Route path="/ict/:categorySlug" element={<ProductList />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminProductManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-categories"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCategoryManager />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
