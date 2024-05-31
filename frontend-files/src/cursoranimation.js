// Cursor.js


import './Cursor.css';

// Cursor.js

import React, { useState, useEffect } from 'react';
import './Cursor.css';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', updateCursorPosition);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
    };
  }, []);

  return (
    <div className="cursor" style={{ left: position.x, top: position.y }}>
      <div className="inner-circle"></div>
    </div>
  );
};

export default Cursor;
