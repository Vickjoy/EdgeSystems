import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import styles from './Login.module.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, fetchUserInfo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.access) {
        localStorage.setItem('access_token', data.access);
        // Optionally: localStorage.setItem('refresh_token', data.refresh);
        await login(data.access); // fetch user info and store in context
        const user = await fetchUserInfo(data.access);
        if (user && (user.is_staff || user.is_superuser)) {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', path: '/' }, { label: 'Login', path: '/login' }]} />
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Login</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input type="text" id="username" className={styles.input} value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input type="password" id="password" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;