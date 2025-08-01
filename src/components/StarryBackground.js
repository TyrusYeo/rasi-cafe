'use client';
import React, { useEffect, useState } from 'react';

const StarryBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const starCount = Math.floor(window.innerWidth / 20); // Responsive star count
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 3
        });
      }
      setStars(newStars);
    };

    generateStars();
    
    const handleResize = () => {
      generateStars();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground; 