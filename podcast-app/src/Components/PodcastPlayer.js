import React, { useState, useEffect } from 'react';
import '../App.css';

const PodcastPlayer = ({ currentEpisode: propCurrentEpisode }) => {
  // State declarations
  const [shows, setShows] = useState([]); // State for storing podcast shows
  const [currentSeason, setCurrentSeason] = useState(null); // State for current season
  const [episodes, setEpisodes] = useState([]); // State for episodes in the current season
  const [currentEpisode, setCurrentEpisode] = useState(propCurrentEpisode || null); // State for currently selected episode
  const [paused, setPaused] = useState(true); // State for play/pause toggle
  const [currentTime, setCurrentTime] = useState(0); // State for current playback time
  const [duration, setDuration] = useState(0); // State for total duration of the audio
  const [audioPlaying, setAudioPlaying] = useState(false); // State to track if audio is playing

  // Effect to fetch initial data when component mounts
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) {
          throw new Error('Failed to fetch shows');
        }
        const data = await response.json();
        setShows(data);

        // Fetch details of the first show and its first season if data is available
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

  // Effect to handle audio element events and update states accordingly
  useEffect(() => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      // Update current time during playback
      audioElement.addEventListener('timeupdate', updateTime);
      // Update duration once metadata is loaded
      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration);
      });

      // Update audio playing state based on play/pause events
      audioElement.addEventListener('play', () => setAudioPlaying(true));
      audioElement.addEventListener('pause', () => setAudioPlaying(false));
    }

    return () => {
      // Cleanup event listeners
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateTime);
        audioElement.removeEventListener('play', () => setAudioPlaying(true));
        audioElement.removeEventListener('pause', () => setAudioPlaying(false));
      }
    };
  }, [currentEpisode]);

  // Effect to update current episode when prop changes
  useEffect(() => {
    if (propCurrentEpisode) {
      setCurrentEpisode(propCurrentEpisode);
      setPaused(false); // Automatically play when a new episode is selected
    }
  }, [propCurrentEpisode]);

  // Function to update current playback time
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
      setCurrentEpisode(season.episodes[0] || null); // Set first episode as default
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

  // Function to fast forward by 10 seconds
  const fastForward = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      audioElement.currentTime += 10;
    }
  };

  // Function to rewind by 10 seconds
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

  // Effect to prompt user before leaving the page if audio is playing
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (audioPlaying) {
        const confirmationMessage = 'Are you sure you want to leave? Your audio is still playing.';
        event.returnValue = confirmationMessage; // Standard way of setting confirmation message in most browsers
        return confirmationMessage; // Required for some browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [audioPlaying]);

  // JSX for rendering the podcast player
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

// Component for displaying playback progress
const PlayerProgress = ({ currentTime, duration }) => {
  const progressPercentage = (currentTime / duration) * 100 || 0;

  return (
    <div className="PlayerProgress">
      <div className="progress" style={{ width: `${progressPercentage}%` }} />
    </div>
  );
};

export default PodcastPlayer;
