import React from 'react';
import './Screens.css';

const WinScreen = ({ score, onPlayAgain, onExit }) => {
  return (
    <div className="screen win-screen">
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
        <h1 className="screen-title victory-title">
          NHIỆM VỤ
          <br />
          HOÀN THÀNH!
        </h1>
        
        <div className="victory-icon">🏆</div>
        
        <div className="score-display">
          <h2>ĐIỂM CUỐI CÙNG</h2>
          <div className="final-score">{score}</div>
        </div>
        
        <div className="victory-message">
          <p>Kỹ năng phát âm xuất sắc, Chỉ huy!</p>
          <p>Bạn đã điều hướng thành công qua vũ trụ!</p>
        </div>
        
        <div className="start-instruction">
          <p className="desktop-instruction">Nhấn SPACE để chơi lại</p>
          <p className="mobile-instruction">Chạm vào nút bên dưới để chơi lại</p>
          <button className="screen-button victory-button" onClick={onPlayAgain}>
            <span>🔄</span>
            Chơi lại
          </button>
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