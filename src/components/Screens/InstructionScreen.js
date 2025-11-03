import React from 'react';
import './Screens.css';

const InstructionScreen = ({ onStartGame, onExit }) => {
  return (
    <div className="screen instruction-screen">
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
        <h2 className="screen-title">CÁCH CHƠI</h2>
        
        <div className="instructions">
          <div className="instruction-item">
            <span className="instruction-number">1</span>
            <p>Một từ sẽ xuất hiện ở cuối màn hình</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">2</span>
            <p className="desktop-instruction">Nhấn SPACE hoặc nút Ghi âm để bắt đầu ghi</p>
            <p className="mobile-instruction">Chạm vào nút Ghi âm để bắt đầu ghi</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">3</span>
            <p>Nói từ đó - VAD sẽ tự động phát hiện và ghi âm</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">4</span>
            <p>Nếu điểm phát âm ≥ 50, tàu vũ trụ sẽ bắn!</p>
          </div>
          
          <div className="instruction-item">
            <span className="instruction-number">5</span>
            <p>Hoàn thành 10 từ trước khi hết thời gian!</p>
          </div>
        </div>
        
        <div className="controls">
          <h3>ĐIỀU KHIỂN</h3>
          <p className="desktop-instruction">SPACE = Bắt đầu ghi âm (Phát hiện giọng nói)</p>
          <p className="mobile-instruction">Nút Ghi âm = Bắt đầu ghi âm (Phát hiện giọng nói)</p>
          <p>Khi bắt đầu ghi, chỉ cần nói từng từ rõ ràng!</p>
          <p>'D' = Chế độ thử nghiệm (đúng ngay lập tức - chỉ máy tính)</p>
          <p>🎤 Cần quyền truy cập microphone!</p>
          <p>🤖 VAD tự động phát hiện khi bạn nói!</p>
        </div>
        
        <div className="start-instruction">
          <p className="desktop-instruction">Nhấn SPACE để bắt đầu nhiệm vụ</p>
          <p className="mobile-instruction">Chạm vào nút bên dưới để bắt đầu</p>
          <button className="screen-button play-button" onClick={onStartGame}>
            <span>🎮</span>
            Bắt đầu nhiệm vụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionScreen;