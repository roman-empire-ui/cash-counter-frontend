// components/LogoOverlay.jsx
import React from 'react';

const LogoOverlay = () => {
  return (
    <div className="fixed bottom-4 right-4 z-40 opacity-50 hover:opacity-90 transition-opacity duration-300">
      <img
        src="/images/logo.jpg"
        alt="Logo"
        className="w-44 object-contain rounded-full shadow-lg"
      />
    </div>
  );
};

export default LogoOverlay;
