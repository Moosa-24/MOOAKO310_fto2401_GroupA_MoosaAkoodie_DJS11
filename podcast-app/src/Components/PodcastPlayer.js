import React, { useState, useEffect } from 'react';
import '../App.css';

// PodcastPlayer component is responsible for rendering and managing the podcast player
const PodcastPlayer = ({ currentEpisode: propCurrentEpisode }) => {
  const [shows, setShows] = useState([]); // State to store all podcast shows
  const [currentSeason, setCurrentSeason] = useState(null); // State to store the current season
  const [episodes, setEpisodes] = useState([]); // State to store episodes of the current season
  const [currentEpisode, setCurrentEpisode] = useState(propCurrentEpisode || null); // State to store the current episode
  const [paused, setPaused] = useState(true); // State to manage play/pause status
  const [currentTime, setCurrentTime] = useState(0); // State to store the current time of the audio
  const [duration, setDuration] = useState(0); // State to store the duration of the audio

  // useEffect hook to fetch podcast shows when the component mounts
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) {
          throw new Error('Failed to fetch shows');
        }
        const data = await response.json();
        setShows(data);

        if (data.length > 0 && data[0].seasons.length > 0) {
          const firstShowId = data[0].id;
          const firstSeasonId = data[0].seasons[0].id;
          await fetchShowDetails(firstShowId, firstSeasonId);
        }
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };

    fetchShows();
  }, []);

  // useEffect hook to set up event listeners for the audio element when the current episode changes
  useEffect(() => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateTime);
      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration);
      });
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateTime);
      }
    };
  }, [currentEpisode]);

  // Function to update the current time of the audio
  const updateTime = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      setCurrentTime(audioElement.currentTime);
    }
  };

  // Function to fetch details of a specific show and season
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
      setCurrentEpisode(season.episodes[0] || null); // Ensure currentEpisode is null if no episodes
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  // Function to play or pause the current episode
  const playPauseEpisode = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      if (paused) {
        audioElement.play();
        setPaused(false);
      } else {
        audioElement.pause();
        setPaused(true);
      }
    }
  };

  // Function to fast forward the current episode by 10 seconds
  const fastForward = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      audioElement.currentTime += 10; 
    }
  };

  // Function to rewind the current episode by 10 seconds
  const rewind = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      audioElement.currentTime -= 10; 
    }
  };

  // Function to skip to the next episode or season
  const skipToNext = () => {
    if (currentSeason && episodes.length > 0 && currentEpisode) {
      const currentIndex = episodes.findIndex(ep => ep === currentEpisode);
      if (currentIndex !== -1 && currentIndex < episodes.length - 1) {
        setCurrentEpisode(episodes[currentIndex + 1]);
        setPaused(false);
      } else {
        const nextSeasonIndex = shows.findIndex(show => show.id === currentSeason.showId) + 1;
        if (nextSeasonIndex < shows.length) {
          const nextSeasonId = shows[nextSeasonIndex].seasons[0].id;
          fetchShowDetails(shows[nextSeasonIndex].id, nextSeasonId);
        }
      }
    }
  };

  // Function to skip to the previous episode or season
  const skipToPrevious = () => {
    if (currentSeason && episodes.length > 0 && currentEpisode) {
      const currentIndex = episodes.findIndex(ep => ep === currentEpisode);
      if (currentIndex > 0) {
        setCurrentEpisode(episodes[currentIndex - 1]);
        setPaused(false);
      } else {
        const previousSeasonIndex = shows.findIndex(show => show.id === currentSeason.showId) - 1;
        if (previousSeasonIndex >= 0) {
          const previousSeasonId = shows[previousSeasonIndex].seasons.slice(-1)[0].id;
          fetchShowDetails(shows[previousSeasonIndex].id, previousSeasonId);
        }
      }
    }
  };

  // useEffect hook to update the current episode when the prop changes
  useEffect(() => {
    if (propCurrentEpisode) {
      setCurrentEpisode(propCurrentEpisode);
      setPaused(false);
    }
  }, [propCurrentEpisode]);

  return (
    <div className="Player">
      {currentEpisode ? (
        <div>
          <div className="EpisodeTitle">{currentEpisode.title}</div>
          <PlayerProgress currentTime={currentTime} duration={duration} />
          <div className="PlayerControls">
            <button onClick={skipToPrevious}>⟸</button>
            <button onClick={rewind}>⟲</button>
            <button onClick={playPauseEpisode}>{paused ? '▷' : '||'}</button>
            <button onClick={fastForward}>⟳</button>
            <button onClick={skipToNext}>⟹</button>
          </div>
          <audio id="audio-element" src={currentEpisode.file} />
        </div>
      ) : (
        <div>
          <div className="EpisodeTitle">PLACEHOLDER AUDIO TRACK</div>
          <PlayerProgress currentTime={currentTime} duration={duration} />
          <div className="PlayerControls">
            <button onClick={skipToPrevious}>⟸</button>
            <button onClick={rewind}>⟲</button>
            <button onClick={playPauseEpisode}>{paused ? '▷' : '||'}</button>
            <button onClick={fastForward}>⟳</button>
            <button onClick={skipToNext}>⟹</button>
          </div>
          <audio id="audio-element" src={"https://podcast-api.netlify.app/placeholder-audio.mp3"} />
        </div>
      )}
    </div>
  );
};

// PlayerProgress component to display the progress of the audio
const PlayerProgress = ({ currentTime, duration }) => {
  const progressPercentage = (currentTime / duration) * 100 || 0;

  return (
    <div className="PlayerProgress">
      <div className="progress" style={{ width: `${progressPercentage}%` }} />
    </div>
  );
};

export default PodcastPlayer;
