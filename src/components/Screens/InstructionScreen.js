import React from 'react';
import './Screens.css';

const InstructionScreen = ({ onStartGame }) => {
  return (
    <div className="screen instruction-screen">
      <div className="screen-content">
        <h2 className="screen-title">HOW TO PLAY</h2>
        
        <div className="instructions">
          <div className="instruction-item">
            <span className="instruction-number">1</span>
            <p>A word will appear at the bottom of the screen</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">2</span>
            <p className="desktop-instruction">Press SPACE or tap Record button to start recording</p>
            <p className="mobile-instruction">Tap the Record button to start recording</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">3</span>
            <p>Speak the word - VAD will auto-detect and record</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">4</span>
            <p>If your pronunciation score ≥ 50, ship will shoot!</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">5</span>
            <p>Complete 10 words before time runs out!</p>
          </div>
        </div>
        
        <div className="controls">
          <h3>CONTROLS</h3>
          <p className="desktop-instruction">SPACE = Start recording (Voice Activity Detection)</p>
          <p className="mobile-instruction">Record Button = Start recording (Voice Activity Detection)</p>
          <p>Once recording starts, just speak each word clearly!</p>
          <p>'D' = Test Mode (instant correct - desktop only)</p>
          <p>🎤 Microphone access required!</p>
          <p>🤖 VAD automatically detects when you speak!</p>
        </div>
        
        <div className="start-instruction">
          <p className="desktop-instruction">Press SPACE to Begin Mission</p>
          <p className="mobile-instruction">Tap the button below to begin</p>
          <button className="screen-button play-button" onClick={onStartGame}>
            <span>🎮</span>
            Begin Mission
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionScreen;