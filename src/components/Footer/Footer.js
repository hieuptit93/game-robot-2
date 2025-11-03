import React from 'react';
import './Footer.css';

const Footer = ({ currentWord, isRecording, isProcessing, recordingStatus, vadActive, isListening, onStartRecording, gameState }) => {
  return (
    <div className="footer">
      <div className="word-display">
        <div className="word-text">{currentWord}</div>
        
        {recordingStatus ? (
          <div className={`recording-status ${isRecording ? 'recording' : isProcessing ? 'processing' : 'result'}`}>
            {recordingStatus}
          </div>
        ) : !vadActive ? (
          <div className="instruction-container">
            <div className="instruction-text">
              <span className="desktop-instruction">Nhấn SPACE để ghi âm hoặc 'D' để thử nghiệm</span>
              <span className="mobile-instruction">Chạm vào nút bên dưới để ghi âm</span>
            </div>
            {gameState === 'playing' && (
              <button 
                className="record-button"
                onClick={onStartRecording}
                disabled={isRecording || isProcessing}
              >
                <div className="record-button-icon">🎤</div>
                <span>Ghi âm</span>
              </button>
            )}
          </div>
        ) : null}
        
        {isRecording && (
          <div className="recording-indicator">
            <div className="recording-dot recording"></div>
            <span>Đang ghi...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;