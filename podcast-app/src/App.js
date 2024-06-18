import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PodcastList from './Components/PodcastList';
import PodcastDetail from './Components/PodcastDetail';
import PodcastPlayer from './Components/PodcastPlayer';
import Loading from './Components/Loading';
import FavoritesList from './Components/FavoritesList'; // Import FavoritesList component
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  useEffect(() => {
    // Simulating some async operation (e.g., fetching data)
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after delay
    }, 5000); // Simulate 5 seconds delay for demonstration purposes
  }, []);

  const toggleFavorite = ({ podcastId, seasonId, episode }) => {
    // Implement logic to handle favorites, possibly using localStorage or API
    console.log(`Toggle favorite: ${episode.title}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className='header-text'>Podcast App</h1>
          <nav className="App-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/favorites">Favorites</Link></li>
            </ul>
          </nav>
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
