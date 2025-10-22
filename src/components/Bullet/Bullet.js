import React from 'react';
import './Bullet.css';

const Bullet = ({ startX, targetX }) => {
  return (
    <div 
      className="bullet"
      style={{
        left: `${startX + 5}%`, // Offset to start from ship's gun position
        top: '50%',
        '--target-x': `${targetX - startX - 5}%`
      }}
    >
      <div className="bullet-core"></div>
      <div className="bullet-trail"></div>
      <div className="bullet-glow"></div>
      
      {/* Multiple bullet projectiles for rapid fire effect */}
      <div className="bullet-secondary" style={{ '--delay': '0.05s' }}>
        <div className="bullet-core"></div>
      </div>
      <div className="bullet-secondary" style={{ '--delay': '0.1s' }}>
        <div className="bullet-core"></div>
      </div>
    </div>
  );
};

export default Bullet;