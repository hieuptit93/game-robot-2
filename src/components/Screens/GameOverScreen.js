import React from 'react';
import './Screens.css';

const GameOverScreen = ({ score, onTryAgain, onExit }) => {
  return (
    <div className="screen gameover-screen">
      {onExit && (
        <button
          onClick={onExit}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 16px',
            border: '1px solid #0ea5e9',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}
        >
          ← Thoát game
        </button>
      )}
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
          <p className="desktop-instruction">Press SPACE to Try Again</p>
          <p className="mobile-instruction">Tap the button below to try again</p>
          <button className="screen-button retry-button" onClick={onTryAgain}>
            <span>🔄</span>
            Try Again
          </button>
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