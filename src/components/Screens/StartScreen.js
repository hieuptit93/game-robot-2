import React from 'react';
import './Screens.css';

const StartScreen = ({ onStart, onExit }) => {
  return (
    <div className="screen start-screen">
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
        <h1 className="game-title">
          CUỘC PHIÊU LƯU
          <br />
          PHÁT ÂM
          <br />
          VŨ TRỤ
        </h1>
        
        <div className="spaceship-logo">🚀</div>
        
        <div className="start-instruction">
          <p className="desktop-instruction">Nhấn SPACE để bắt đầu</p>
          <p className="mobile-instruction">Chạm vào nút bên dưới để bắt đầu</p>
          <button className="screen-button start-button" onClick={onStart}>
            <span>🚀</span>
            Bắt đầu chơi
          </button>
        </div>
        
        <div className="credits">
          Học phát âm tiếng Anh qua trận chiến vũ trụ!
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