import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LandingPage from './LandingPage';
import { LoginScreen, useAuth } from './SuperAdmin';
import reportWebVitals from './reportWebVitals';

function Root() {
  const { user, login, logout } = useAuth();
  const path = window.location.pathname;

  if (path === '/landing' || path === '/landing/') return <LandingPage />;
  if (!user) return <LoginScreen onLogin={login} />;
  return <App user={user} onLogout={logout} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();
