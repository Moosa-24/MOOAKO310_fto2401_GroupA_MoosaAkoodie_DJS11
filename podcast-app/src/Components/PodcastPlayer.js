import React, { useState, useEffect } from 'react';
import '../App.css';

const PodcastPlayer = () => {
  const [shows, setShows] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(null); // Track current season
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [seasonsVisible, setSeasonsVisible] = useState(false); // State for showing/hiding seasons

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const response = await fetch('https://podcast-api.netlify.app');
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      const data = await response.json();
      setShows(data); // Assuming data is an array of shows
      // Load episodes of the first show's first season initially
      if (data.length > 0 && data[0].seasons.length > 0) {
        setCurrentSeason(data[0].seasons[0]); // Set initial season
        setEpisodes(data[0].seasons[0].episodes); // Set initial episodes
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
    }
  };

  const playEpisode = (episode) => {
    setCurrentEpisode(episode);
    // Logic to play the episode
    // Example: use <audio> HTML element to play audio
  };

  const switchSeason = (season) => {
    setCurrentSeason(season);
    setEpisodes(season.episodes);
    setSeasonsVisible(false); // Hide seasons after selecting a season
  };

  const toggleSeasonsVisibility = () => {
    setSeasonsVisible(!seasonsVisible);
  };

  const closeSeasonsList = () => {
    setSeasonsVisible(false);
  };

  return (
    <div className="Player">
      <h2>Podcast Player</h2>
      <audio controls>
        <source src={currentEpisode ? currentEpisode.audio : ''} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="PlayerControls">
        {episodes.map(episode => (
          <button key={episode.id} onClick={() => playEpisode(episode)}>
            {episode.title}
          </button>
        ))}
      </div>
      <div>
        <h3>Switch Season</h3>
        <button className="ToggleSeasonsButton" onClick={toggleSeasonsVisibility}>
          {seasonsVisible ? 'Hide Seasons' : 'Show Seasons'}
        </button>
        {seasonsVisible && (
          <ul className="SeasonsList">
            {shows.map(show => (
              <li key={show.id}>
                <h4>{show.title}</h4>
                {show.seasons.length > 0 && (
                  <button onClick={() => switchSeason(show.seasons[0])}>
                    Season {show.seasons[0].number}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {seasonsVisible && (
        <button className="CloseSeasonsButton" onClick={closeSeasonsList}>
          Close Seasons
        </button>
      )}
    </div>
  );
};

export default PodcastPlayer;
