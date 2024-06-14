import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const Loading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Timer for 5 seconds

    return () => clearTimeout(timer); // Clear the timer if component unmounts
  }, []); // Run this effect only once when component mounts

  return (
    <div className="loading-screen">
      <img src="/images/podcast-logo.png" alt="Logo" className="App-logo" />
    </div>
  );
};

export default Loading;
