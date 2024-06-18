import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../App.css';

const PodcastDetail = ({ setCurrentEpisode }) => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  // This useEffect hook fetches podcast details from the API when the component mounts or the ID changes
  useEffect(() => {
    const fetchPodcastDetails = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch podcast details');
        }
        const data = await response.json();

        const seasons = Array.isArray(data.seasons) ? data.seasons : [];

        const podcastDetails = {
          id: data.id,
          title: data.title,
          image: data.image,
          description: data.description,
          seasons: seasons.map((season, index) => ({
            id: season.id,
            title: `Season ${index + 1}`,
            episodes: season.episodes,
            previewImage: season.image
          })),
        };

        setPodcast(podcastDetails);
      } catch (error) {
        console.error('Error fetching podcast details:', error);
      }
    };

    fetchPodcastDetails();
  }, [id]);

  // This useEffect hook loads the list of favorite episodes from localStorage when the component mounts
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // This function adds or removes an episode from the favorites list
  const toggleFavorite = (episode) => {
    if (!podcast) return; // Ensure podcast details are loaded

    const { id: podcastId, seasons } = podcast;
    const { id: episodeId } = episode;
    const seasonId = seasons[selectedSeason].id;

    const isFavorited = favorites.some(fav =>
      fav.podcastId === podcastId &&
      fav.seasonId === seasonId &&
      fav.episodeId === episodeId
    );

    if (isFavorited) {
      const updatedFavorites = favorites.filter(fav =>
        !(fav.podcastId === podcastId &&
          fav.seasonId === seasonId &&
          fav.episodeId === episodeId)
      );
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      const newFavorite = {
        podcastId,
        seasonId,
        episodeId,
        title: episode.title,
        timestamp: new Date().toISOString(), // Add timestamp when favorited
      };
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  // This function toggles the visibility of the season dropdown menu
  const toggleSeasonDropdown = () => {
    setSeasonDropdownOpen(!seasonDropdownOpen);
  };

  // This function changes the selected season when a new season is selected from the dropdown
  const handleSeasonChange = (index) => {
    setSelectedSeason(index);
    setSeasonDropdownOpen(false);
  };

  // This function sets the current episode in the parent component when an episode is selected
  const handleEpisodeSelect = (episode) => {
    setCurrentEpisode(episode);
  };

  // This function checks if an episode is in the favorites list
  const isFavorite = (episodeId) => {
    return favorites.some(fav =>
      fav.episodeId === episodeId
    );
  };

  // If the podcast details are not yet loaded, show a loading screen
  if (!podcast) {
    return (
      <div className="loading-screen">
        <div className="App-logo">Loading...</div>
      </div>
    );
  }

  return (
    <div className="PodcastDetailContainer" style={{ paddingTop: '50px' }}>
      <h2>{podcast.title}</h2>
      <img src={podcast.image} alt={podcast.title} className="PodcastDetailImage" />
      <div className="PodcastDetailDescription">{podcast.description}</div>

      <div className="SeasonSelector">
        <button onClick={toggleSeasonDropdown} className="SeasonButton">
          {podcast.seasons[selectedSeason].title}
          <span className="DropdownArrow">{seasonDropdownOpen ? '▲' : '▼'}</span>
        </button>
        {seasonDropdownOpen && (
          <div className="SeasonDropdown">
            {podcast.seasons.map((season, index) => (
              <button
                key={season.id}
                onClick={() => handleSeasonChange(index)}
                className={`SeasonButton ${index === selectedSeason ? "active" : ""}`}
              >
                {season.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="PodcastSeason">
        <h3>{podcast.seasons[selectedSeason].title}</h3>
        {podcast.seasons[selectedSeason].previewImage && (
          <img
            src={podcast.seasons[selectedSeason].previewImage}
            alt={`Preview for ${podcast.seasons[selectedSeason].title}`}
            className="SeasonPreviewImage"
          />
        )}
        <div className="EpisodeList">
          <div className="EpisodesHeader"><h4>Episodes:</h4></div>
          {podcast.seasons[selectedSeason].episodes.length > 0 ? (
            podcast.seasons[selectedSeason].episodes.map((episode, index) => (
              <div
                key={episode.id}
                className="Episode"
                onClick={() => handleEpisodeSelect(episode)}
              >
                <span className="EpisodeNumber">{index + 1}.</span>
                <span className="EpisodeTitle">{episode.title}</span>
                <button
                  className="FavoriteButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(episode);
                  }}
                >
                  {isFavorite(episode.id) ? '❤️' : '🤍'}
                </button>
              </div>
            ))
          ) : (
            <div className="Episode">
              <span className="EpisodeTitle">PLACEHOLDER AUDIO TRACK</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Define the expected prop types for this component
PodcastDetail.propTypes = {
  // setCurrentEpisode is a function that is required to be passed to this component
  setCurrentEpisode: PropTypes.func.isRequired,
};

export default PodcastDetail;
