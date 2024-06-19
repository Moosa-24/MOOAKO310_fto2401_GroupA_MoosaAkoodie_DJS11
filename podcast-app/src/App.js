import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PodcastList from './Components/PodcastList';
import PodcastDetail from './Components/PodcastDetail';
import PodcastPlayer from './Components/PodcastPlayer';
import Loading from './Components/Loading';
import FavoritesList from './Components/FavoritesList';
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  useEffect(() => {
    // Simulating some async operation (e.g. fetching data)
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after delay
    }, 5000); 
  }, []);

  const toggleFavorite = ({ podcastId, seasonId, episode }) => {
    // Implement logic to handle favorites
    console.log(`Toggle favorite: ${episode.title}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>Podcast App</h1>
          </Link>

          <Link to="/favorites" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>Favorites</h1>
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<PodcastList setCurrentEpisode={setCurrentEpisode} />} />
          <Route
            path="/podcast/:id"
            element={<PodcastDetail setCurrentEpisode={setCurrentEpisode} toggleFavorite={toggleFavorite} />}
          />
          <Route path="/favorites" element={<FavoritesList />} />
        </Routes>

        {/* Always render PodcastPlayer */}
        <PodcastPlayer currentEpisode={currentEpisode} />
      </div>
    </Router>
  );
};

export default App;
