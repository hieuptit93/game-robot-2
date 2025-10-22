import React from 'react';
import './Screens.css';

const InstructionScreen = () => {
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
            <p>Press SPACE to activate VAD (Voice Activity Detection)</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">3</span>
            <p>Speak the word - VAD will auto-detect and record</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">4</span>
            <p>If your pronunciation score > 60, ship will shoot!</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">5</span>
            <p>Complete 10 words before time runs out!</p>
          </div>
        </div>
        
        <div className="controls">
          <h3>CONTROLS</h3>
          <p>SPACE = Start/Stop VAD (Voice Activity Detection)</p>
          <p>Once VAD is active, just speak each word - no need to press SPACE again!</p>
          <p>'D' = Test Mode (instant correct)</p>
          <p>'T' = Test API Connection</p>
          <p>🎤 Microphone access required!</p>
          <p>🤖 VAD automatically detects when you speak and continues listening!</p>
        </div>
        
        <div className="start-instruction">
          <p>Press SPACE to Begin Mission</p>
        </div>
      </div>
    </div>
  );
};

export default InstructionScreen;