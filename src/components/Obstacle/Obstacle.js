import React from 'react';
import './Obstacle.css';

const Obstacle = ({ position, showExplosion, isVisible = true }) => {

  if (!isVisible) return null;

  return (
    <div
      className={`obstacle ${showExplosion ? 'exploding' : ''}`}
      style={{
        left: `${position}%`,
        top: '45%'
      }}
    >
      <div className="asteroid">
        <div className="asteroid-surface"></div>
        <div className="asteroid-crater crater-1"></div>
        <div className="asteroid-crater crater-2"></div>
        <div className="asteroid-crater crater-3"></div>
      </div>
    </div>
  );
};

export default Obstacle;