'use client';
import React, { useState, useEffect } from 'react';
import styles from './typewrite.css';

const Typewriter = () => {
  const textArray = ["First string.", "Second string.", "Third string."];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentStringIndex = 0;
    let currCharCount = 0;
    
    const intervalId = setInterval(() => {
      const currentChar = textArray[currentStringIndex % textArray.length][charCount];
      
      setDisplayText((prevDisplayString) => prevDisplayString + currentChar);
      currCharCount++ 
      // Move to next string
      if (currCharCount === textArray[currentStringIndex % textArray.length].length) {
        currentStringIndex++;
      }

      console.log(textArray[currentStringIndex % textArray.length].length)
      console.log(currCharCount)

      // Stop the interval when all characters are appended
      if (currentStringIndex === textArray.length && displayString.length === textArray[currentStringIndex - 1].length) {
        clearInterval(intervalId);
      }

    }, 600);

    return () => clearInterval(intervalId);
  }, [currentTextIndex]);

  return <span className={styles.typewriter}>{displayText}</span>;
};

export default Typewriter;