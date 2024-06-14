import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PodcastList from './Components/PodcastList';
import PodcastDetail from './Components/PodcastDetail';
import PodcastPlayer from './Components/PodcastPlayer';
import Loading from './Components/Loading';
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPodcast, setCurrentPodcast] = useState(null);

  useEffect(() => {
    // Simulating some async operation (e.g., fetching data)
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after delay
    }, 5000); // Simulate 5 seconds delay for demonstration purposes
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PodcastList setCurrentPodcast={setCurrentPodcast} />} />
          <Route path="/podcast/:id" element={<PodcastDetail setCurrentPodcast={setCurrentPodcast} />} />
        </Routes>
        
        {/* Conditionally render PodcastPlayer */}
        {currentPodcast && <PodcastPlayer podcast={currentPodcast} />}
      </div>
    </Router>
  );
};

export default App;
