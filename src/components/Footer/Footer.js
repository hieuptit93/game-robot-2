import React from 'react';
import './Footer.css';

const Footer = ({ currentWord, isRecording, isProcessing, recordingStatus, vadActive, isListening }) => {
  return (
    <div className="footer">
      <div className="word-display">
        <div className="word-text">{currentWord}</div>
        
        {recordingStatus ? (
          <div className={`recording-status ${isRecording ? 'recording' : isProcessing ? 'processing' : 'result'}`}>
            {recordingStatus}
          </div>
        ) : !vadActive ? (
          <div className="instruction-text">
            Press SPACE to start continuous recording or 'D' to test
          </div>
        ) : null}
        
        {isRecording && (
          <div className="recording-indicator">
            <div className="recording-dot recording"></div>
            <span>Recording...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;