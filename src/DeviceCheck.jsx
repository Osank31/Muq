import React from 'react';
import { isMobile, isTablet } from 'react-device-detect';

const DeviceCheck = ({ children }) => {
  if (isMobile || isTablet) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1rem',
        fontSize: '1.5rem'
      }}>
        🚫 Please access this site using a desktop device.
      </div>
    );
  }

  return children;
};

export default DeviceCheck;