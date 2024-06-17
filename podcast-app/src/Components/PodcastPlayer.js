import React, { useState, useEffect } from 'react';
import '../App.css';

const PodcastPlayer = ({ currentEpisode: propCurrentEpisode }) => {
  const [shows, setShows] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(propCurrentEpisode || null);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const updateTime = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      setCurrentTime(audioElement.currentTime);
    }
  };

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

  const fastForward = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      audioElement.currentTime += 10; 
    }
  };

  const rewind = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      audioElement.currentTime -= 10; 
    }
  };

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

const PlayerProgress = ({ currentTime, duration }) => {
  const progressPercentage = (currentTime / duration) * 100 || 0;

  return (
    <div className="PlayerProgress">
      <div className="progress" style={{ width: `${progressPercentage}%` }} />
    </div>
  );
};

export default PodcastPlayer;