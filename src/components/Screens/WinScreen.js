import React from 'react';
import './Screens.css';

const WinScreen = ({ score }) => {
  return (
    <div className="screen win-screen">
      <div className="screen-content">
        <h1 className="screen-title victory-title">
          MISSION
          <br />
          ACCOMPLISHED!
        </h1>
        
        <div className="victory-icon">🏆</div>
        
        <div className="score-display">
          <h2>FINAL SCORE</h2>
          <div className="final-score">{score}</div>
        </div>
        
        <div className="victory-message">
          <p>Excellent pronunciation skills, Commander!</p>
          <p>You've successfully navigated through space!</p>
        </div>
        
        <div className="start-instruction">
          <p>Press SPACE to Play Again</p>
        </div>
      </div>
      
      <div className="celebration-particles">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WinScreen;