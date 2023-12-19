'use client';
import React, { useState, useEffect } from 'react';
import styles from './typewrite.css';

const Typewriter = () => {
  const textArray = ["welcome", "solve the lonliness epidemic", "join The Third Space"];
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentStringIndex = 0;
    let currCharCount = 0;
    
    const intervalId = setInterval(() => {
      const currentChar = textArray[currentStringIndex % textArray.length][currCharCount];

      console.log(currCharCount)
      
      setDisplayText((prevDisplayString) => prevDisplayString + currentChar);
      currCharCount++ 
      
      // Move to next string
      if (currCharCount === textArray[currentStringIndex % textArray.length].length + 1) {
        setDisplayText("");
        currentStringIndex++;
        currCharCount = 0;
      }
    }, 450);

    return () => clearInterval(intervalId);
  }, []);

  return <span className={styles.typewriter}>{displayText}</span>;
};

export default Typewriter;