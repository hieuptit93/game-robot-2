import React from 'react';
import PlayerShip from '../PlayerShip/PlayerShip';
import Obstacle from '../Obstacle/Obstacle';
import Stars from '../Stars/Stars';
import Bullet from '../Bullet/Bullet';
import Explosion from '../Explosion/Explosion';
import BackgroundObjects from '../BackgroundObjects/BackgroundObjects';
import './GameArea.css';

const GameArea = ({ 
  backgroundOffset, 
  showBullet, 
  showExplosion, 
  questionsAnswered, 
  totalQuestions,
  isMoving 
}) => {
  const playerPosition = 15; // Fixed position for player ship (closer to left edge)
  const obstaclePosition = 75; // Fixed position for the current obstacle
  
  return (
    <div className={`game-area ${isMoving ? 'moving' : ''}`}>
      <Stars isMoving={isMoving} backgroundOffset={backgroundOffset} />
      <BackgroundObjects backgroundOffset={backgroundOffset} />
      
      <div className="game-content">
        <PlayerShip position={playerPosition} isShooting={showBullet} />
        
        {showBullet && (
          <Bullet 
            startX={playerPosition} 
            targetX={obstaclePosition} 
          />
        )}
        
        {questionsAnswered < totalQuestions && (
          <Obstacle 
            position={obstaclePosition}
            showExplosion={showExplosion}
            isVisible={!showExplosion}
          />
        )}
        
        {showExplosion && (
          <Explosion 
            x={obstaclePosition} 
            y={50} 
          />
        )}
      </div>
    </div>
  );
};

export default GameArea;