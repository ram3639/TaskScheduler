import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogin = (jwt, user) => {
    setToken(jwt);
    setUsername(user);
    localStorage.setItem('token', jwt);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  // Helper to show dashboard title only on dashboard route
  const location = window.location.pathname;
  const showDashboardTitle = token && location.includes('dashboard');

  return (
    <Router>
      <nav>
        <div className="nav-left">
          {token && <span className="welcome-username">Welcome, {username}!</span>}
        </div>
        {showDashboardTitle && <div className="dashboard-nav-title">Task Dashboard</div>}
        <div className="nav-right">
          {token ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <div className="nav-auth-center">
              <Link to="/login">Login</Link>
              <span style={{margin: '0 0.5rem', color: '#b0b0b0'}}>|</span>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
