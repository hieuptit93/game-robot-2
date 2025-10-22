import React from 'react';
import planeImage from '../../assets/plane/Default.png';
import './PlayerShip.css';

const PlayerShip = ({ position, isShooting }) => {
  return (
    <div 
      className={`player-ship ${isShooting ? 'shooting' : ''}`}
      style={{ 
        left: `${position}%`,
        top: '50%'
      }}
    >
      <img 
        src={planeImage} 
        alt="Player Ship" 
        className="ship-image"
        onError={(e) => {
          // Fallback to SVG ship if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      
      {/* SVG Fallback Ship */}
      <svg 
        className="ship-svg" 
        width="80" 
        height="40" 
        viewBox="0 0 80 40" 
        style={{ display: 'none' }}
      >
        {/* Ship body */}
        <ellipse cx="40" cy="20" rx="35" ry="8" fill="#4a90e2" stroke="#2c5aa0" strokeWidth="2"/>
        
        {/* Ship nose */}
        <polygon points="70,20 85,15 85,25" fill="#ff4444" stroke="#cc3333" strokeWidth="1"/>
        
        {/* Wings */}
        <ellipse cx="25" cy="12" rx="15" ry="4" fill="#357abd" stroke="#2c5aa0" strokeWidth="1"/>
        <ellipse cx="25" cy="28" rx="15" ry="4" fill="#357abd" stroke="#2c5aa0" strokeWidth="1"/>
        
        {/* Engine */}
        <rect x="5" y="16" width="12" height="8" rx="2" fill="#666" stroke="#888" strokeWidth="1"/>
        
        {/* Engine flame */}
        <ellipse cx="2" cy="20" rx="8" ry="3" fill="url(#flameGradient)">
          <animateTransform 
            attributeName="transform" 
            type="scale" 
            values="1,1;1.3,1.2;1,1" 
            dur="0.2s" 
            repeatCount="indefinite"
          />
        </ellipse>
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="50%" stopColor="#ffaa00"/>
            <stop offset="100%" stopColor="#ff6600"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="ship-body fallback-ship" style={{ display: 'none' }}>
        <div className="ship-nose"></div>
        <div className="ship-wing ship-wing-top"></div>
        <div className="ship-wing ship-wing-bottom"></div>
        <div className="ship-engine"></div>
      </div>
      
      {/* Muzzle flash effect when shooting */}
      {isShooting && (
        <div className="muzzle-flash">
          <div className="flash-core"></div>
          <div className="flash-outer"></div>
        </div>
      )}
    </div>
  );
};

export default PlayerShip;