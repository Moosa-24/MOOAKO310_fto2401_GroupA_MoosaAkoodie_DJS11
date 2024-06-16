import React, { useState, useEffect } from 'react';
import '../App.css'; 

const Loading = () => {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Timer for 5 seconds

    return () => clearTimeout(timer); // Clear the timer if component unmounts
  }, []); // Run this effect only once when component mounts

  return (
    <div className="loading-screen">
      <img src="/images/podcasts-logo.png" alt="Logo" className="App-logo" />
    </div>
  );
};

export default Loading;
