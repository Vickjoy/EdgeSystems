import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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
import AdminLayout from './components/AdminLayout';
import AdminSubcategoryManager from './pages/AdminSubcategoryManager';

const App = () => {
  const location = useLocation();
  // List of admin routes where Header/Footer should be hidden
  const adminRoutes = [
    '/admin-dashboard',
    '/admin-products',
    '/admin-categories',
    '/admin-subcategories'
  ];
  // Check if current path starts with any admin route
  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div>
      {!isAdminRoute && <Header />}
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
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminProductManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-categories"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminCategoryManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-subcategories"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminSubcategoryManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
