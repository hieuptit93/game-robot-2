import React from 'react';
import './Screens.css';

const GameOverScreen = ({ score }) => {
  return (
    <div className="screen gameover-screen">
      <div className="screen-content">
        <h1 className="screen-title gameover-title">
          MISSION
          <br />
          FAILED
        </h1>
        
        <div className="gameover-icon">💥</div>
        
        <div className="score-display">
          <h2>FINAL SCORE</h2>
          <div className="final-score">{score}</div>
        </div>
        
        <div className="gameover-message">
          <p>Time ran out, Commander!</p>
          <p>Keep practicing your pronunciation skills.</p>
        </div>
        
        <div className="start-instruction">
          <p>Press SPACE to Try Again</p>
        </div>
      </div>
      
      <div className="static-effect">
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="static-pixel"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GameOverScreen;