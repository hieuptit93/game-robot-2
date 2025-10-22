import React, { useEffect, useState } from 'react';
import './BackgroundObjects.css';

const BackgroundObjects = ({ backgroundOffset }) => {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    const generateObjects = () => {
      const objectArray = [];
      for (let i = 0; i < 8; i++) {
        objectArray.push({
          id: i,
          x: Math.random() * 120 + 100, // Start from right side
          y: Math.random() * 60 + 20,
          size: Math.random() * 20 + 15,
          type: Math.random() > 0.5 ? 'asteroid' : 'planet',
          speed: Math.random() * 0.3 + 0.7
        });
      }
      setObjects(objectArray);
    };

    generateObjects();
  }, []);

  return (
    <div className="background-objects">
      {objects.map(obj => (
        <div
          key={obj.id}
          className={`bg-object ${obj.type}`}
          style={{
            left: `${obj.x - (backgroundOffset * obj.speed)}%`,
            top: `${obj.y}%`,
            width: `${obj.size}px`,
            height: `${obj.size}px`
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundObjects;