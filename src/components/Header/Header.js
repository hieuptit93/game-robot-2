import React from 'react';
import './Header.css';

const Header = ({ progress, timeLeft, score }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="header">
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="spaceship-icon">🚀</div>
      </div>
      
      <div className="timer">
        {formatTime(timeLeft)}
      </div>
      
      <div className="score">
        Score: {score}
      </div>
    </div>
  );
};

export default Header;