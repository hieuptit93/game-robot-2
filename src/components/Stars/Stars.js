import React, { useEffect, useState } from 'react';
import './Stars.css';

const Stars = ({ isMoving, backgroundOffset }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 200; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 150, // Extend beyond 100% to allow for scrolling
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          animationDelay: Math.random() * 3,
          speed: Math.random() * 0.5 + 0.2,
          layer: Math.random() > 0.5 ? 'far' : 'near' // Different layers for parallax
        });
      }
      setStars(starArray);
    };

    generateStars();
  }, []);

  return (
    <div className={`stars-container ${isMoving ? 'stars-moving' : ''}`}>
      {stars.map(star => (
        <div
          key={star.id}
          className={`star star-${star.layer}`}
          style={{
            left: `${star.x - (backgroundOffset * (star.layer === 'near' ? 1.5 : 0.8))}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.animationDelay}s`,
            '--speed': star.speed
          }}
        />
      ))}
    </div>
  );
};

export default Stars;