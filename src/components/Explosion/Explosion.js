import React from 'react';
import './Explosion.css';

const Explosion = ({ x, y }) => {
  return (
    <div 
      className="explosion"
      style={{
        left: `${x}%`,
        top: `${y}%`
      }}
    >
      <div className="explosion-center"></div>
      <div className="explosion-ring ring-1"></div>
      <div className="explosion-ring ring-2"></div>
      <div className="explosion-ring ring-3"></div>
      
      {/* Main particles */}
      <div className="explosion-particle particle-1"></div>
      <div className="explosion-particle particle-2"></div>
      <div className="explosion-particle particle-3"></div>
      <div className="explosion-particle particle-4"></div>
      
      {/* Diagonal particles */}
      <div className="explosion-particle particle-5"></div>
      <div className="explosion-particle particle-6"></div>
      <div className="explosion-particle particle-7"></div>
      <div className="explosion-particle particle-8"></div>
      
      {/* Debris pieces */}
      <div className="debris debris-1"></div>
      <div className="debris debris-2"></div>
      <div className="debris debris-3"></div>
      <div className="debris debris-4"></div>
      <div className="debris debris-5"></div>
      <div className="debris debris-6"></div>
    </div>
  );
};

export default Explosion;