import React, { useState, useEffect } from 'react';
import '../App.css';

const PodcastPlayer = () => {
  const [shows, setShows] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(null); // Track current season
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [seasonsVisible, setSeasonsVisible] = useState(false); // State for showing/hiding seasons
  const [paused, setPaused] = useState(true); // State for pause/unpause

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) {
          throw new Error('Failed to fetch shows');
        }
        const data = await response.json();
        setShows(data); // data is an array of shows
    
        // Load episodes of the first show's first season initially
        if (data.length > 0 && data[0].seasons.length > 0) {
          const firstShowId = data[0].id;
          const firstSeasonId = data[0].seasons[0].id;
          await fetchShowDetails(firstShowId, firstSeasonId);
        }
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };

    fetchShows(); // Call fetchShows directly inside useEffect
  }, []);

  const fetchShowDetails = async (showId, seasonId) => {
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const data = await response.json();
      const season = data.seasons.find(season => season.id === seasonId);
      if (!season) {
        throw new Error(`Season with ID ${seasonId} not found in show ${showId}`);
      }
      setCurrentSeason(season);
      setEpisodes(season.episodes);
      setCurrentEpisode(season.episodes[0]); // Assuming the first episode by default
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  const playPauseEpisode = (episode) => {
    if (paused) {
      // If paused, play the episode
      setCurrentEpisode(episode);
      setPaused(false);
      // Logic to play the episode
      // Example: use <audio> HTML element to play audio
    } else {
      // If playing, pause the episode
      setPaused(true);
      // Logic to pause the current episode
    }
  };

  const fastForward = () => {
    if (currentEpisode && episodes.length > 0) {
      const currentIndex = episodes.findIndex(ep => ep === currentEpisode);
      if (currentIndex !== -1 && currentIndex < episodes.length - 1) {
        setCurrentEpisode(episodes[currentIndex + 1]);
        setPaused(false); // Ensure playback resumes after skipping
      }
    }
  };
  
  const rewind = () => {
    if (currentEpisode && episodes.length > 0) {
      const currentIndex = episodes.findIndex(ep => ep === currentEpisode);
      if (currentIndex !== -1 && currentIndex > 0) {
        setCurrentEpisode(episodes[currentIndex - 1]);
        setPaused(false); // Ensure playback resumes after skipping
      }
    }
  };
  
  const skipToNext = () => {
    if (currentSeason && episodes.length > 0 && currentEpisode) {
      const currentIndex = episodes.findIndex(ep => ep === currentEpisode);
      if (currentIndex !== -1 && currentIndex < episodes.length - 1) {
        setCurrentEpisode(episodes[currentIndex + 1]);
        setPaused(false); // Ensure playback resumes after skipping
      } else {
        // Handle end of season logic
        const nextSeasonIndex = shows.findIndex(show => show.id === currentSeason.showId) + 1;
        if (nextSeasonIndex < shows.length) {
          const nextSeasonId = shows[nextSeasonIndex].seasons[0].id;
          fetchShowDetails(shows[nextSeasonIndex].id, nextSeasonId);
        }
      }
    }
  };
  
  const goToPrevious = () => {
    if (currentSeason && episodes.length > 0 && currentEpisode) {
      const currentIndex = episodes.findIndex(ep => ep === currentEpisode);
      if (currentIndex !== -1 && currentIndex > 0) {
        setCurrentEpisode(episodes[currentIndex - 1]);
        setPaused(false); // Ensure playback resumes after skipping
      } else {
        // Handle start of season logic
        const prevSeasonIndex = shows.findIndex(show => show.id === currentSeason.showId) - 1;
        if (prevSeasonIndex >= 0) {
          const prevSeasonId = shows[prevSeasonIndex].seasons.slice(-1)[0].id;
          fetchShowDetails(shows[prevSeasonIndex].id, prevSeasonId);
        }
      }
    }
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
        <button onClick={goToPrevious}>↩</button>
        <button onClick={rewind}>↺</button>
        <button onClick={playPauseEpisode}>{paused ? '▷' : '||'}</button>
        <button onClick={fastForward}>↻</button>
        <button onClick={skipToNext}>↪</button>
      </div>
      <div>
        <h3>Switch Season</h3>
        <button className="ToggleSeasonsButton" onClick={toggleSeasonsVisibility}>
          {seasonsVisible ? 'Hide Seasons' : 'Show Seasons'}
        </button>
        {seasonsVisible && (
          <ul className="SeasonsList">
            {shows.map((show) => (
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
