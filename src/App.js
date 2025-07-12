import React, { useState, useEffect } from 'react';
import VoucherManager from './VoucherManager';
import MoWaveArchitectureApp from './dashboard';
import Login from './Login';
import ToastContainer from './components/ToastContainer';
import { STORAGE_KEYS } from './config';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('vouchers'); // 'vouchers' or 'dashboard'

  useEffect(() => {
    // Check if user is already logged in
    const loginStatus = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (loginStatus === 'true' && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('vouchers');
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (window.showToast) {
      window.showToast('Logged out successfully', 'info');
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : currentView === 'dashboard' ? (
        <MoWaveArchitectureApp user={user} onLogout={handleLogout} onViewChange={handleViewChange} />
      ) : (
        <VoucherManager user={user} onLogout={handleLogout} onViewChange={handleViewChange} />
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
