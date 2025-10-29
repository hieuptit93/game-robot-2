import React from 'react';
import './Screens.css';

const StartScreen = ({ onStart }) => {
  return (
    <div className="screen start-screen">
      <div className="screen-content">
        <h1 className="game-title">
          SPACE
          <br />
          PRONUNCIATION
          <br />
          ADVENTURE
        </h1>
        
        <div className="spaceship-logo">🚀</div>
        
        <div className="start-instruction">
          <p className="desktop-instruction">Press SPACE to Start</p>
          <p className="mobile-instruction">Tap the button below to start</p>
          <button className="screen-button start-button" onClick={onStart}>
            <span>🚀</span>
            Start Game
          </button>
        </div>
        
        <div className="credits">
          Learn English pronunciation through space combat!
        </div>
      </div>
      
      <div className="background-stars">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="bg-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StartScreen;