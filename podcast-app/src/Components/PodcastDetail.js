import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importing necessary modules
import PropTypes from 'prop-types'; // Importing PropTypes for prop validation
import '../App.css'; // Importing CSS file for styling

// Functional component to display podcast details
const PodcastDetail = ({ setCurrentEpisode }) => {
  const { id } = useParams(); // Extracting 'id' parameter from URL using useParams hook
  const [podcast, setPodcast] = useState(null); // State to store podcast details
  const [favorites, setFavorites] = useState([]); // State to manage favorite episodes
  const [selectedSeason, setSelectedSeason] = useState(0); // State to track selected season index
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false); // State to manage season dropdown visibility

  // Effect hook to fetch podcast details when 'id' changes
  useEffect(() => {
    // Async function to fetch podcast details
    const fetchPodcastDetails = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`); // Fetching podcast details from API
        if (!response.ok) {
          throw new Error('Failed to fetch podcast details'); // Throw error if response is not okay
        }
        const data = await response.json(); // Parsing response data

        // Mapping received data to required podcast details structure
        const seasons = Array.isArray(data.seasons) ? data.seasons : []; // Handling seasons array

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

        setPodcast(podcastDetails); // Setting fetched podcast details to state
      } catch (error) {
        console.error('Error fetching podcast details:', error); // Logging error if fetch fails
      }
    };

    fetchPodcastDetails(); // Calling fetch function
  }, [id]); // Dependency array with 'id'

  // Effect hook to load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites'); // Getting stored favorites from localStorage
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites)); // Parsing and setting favorites state
    }
  }, []); // Empty dependency array to run once on mount

  // Function to toggle favorite status of an episode
  const toggleFavorite = (episode) => {
    if (!podcast) return; // Exit early if podcast details are not loaded

    const { id: podcastId, seasons } = podcast; // Destructuring podcast details
    const { id: episodeId } = episode; // Destructuring episode details
    const seasonId = seasons[selectedSeason].id; // Getting selected season id

    // Checking if episode is already favorited
    const isFavorited = favorites.some(fav =>
      fav.podcastId === podcastId &&
      fav.seasonId === seasonId &&
      fav.episodeId === episodeId
    );

    let updatedFavorites;
    if (isFavorited) {
      updatedFavorites = favorites.filter(fav =>
        !(fav.podcastId === podcastId &&
          fav.seasonId === seasonId &&
          fav.episodeId === episodeId)
      );
    } else {
      // Creating new favorite object
      const newFavorite = {
        podcastId,
        seasonId,
        episodeId,
        title: episode.title,
        showTitle: podcast.title, // Adding show title to favorite object
        seasonTitle: seasons[selectedSeason].title, // Adding season title to favorite object
        timestamp: new Date().toISOString(),
      };
      updatedFavorites = [...favorites, newFavorite]; // Adding new favorite to favorites array
    }

    setFavorites(updatedFavorites); // Updating favorites state
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Storing updated favorites in localStorage
  };

  // Function to toggle visibility of season dropdown
  const toggleSeasonDropdown = () => {
    setSeasonDropdownOpen(!seasonDropdownOpen); // Toggling season dropdown state
  };

  // Function to handle season change
  const handleSeasonChange = (index) => {
    setSelectedSeason(index); // Setting selected season index
    setSeasonDropdownOpen(false); // Closing season dropdown
  };

  // Function to handle episode selection
  const handleEpisodeSelect = (episode) => {
    setCurrentEpisode(episode); // Setting current episode using callback prop
  };

  // Function to check if an episode is favorited
  const isFavorite = (episodeId) => {
    return favorites.some(fav => fav.episodeId === episodeId); // Checking if episode id is in favorites
  };

  // Loading screen if podcast details are not loaded yet
  if (!podcast) {
    return (
      <div className="loading-screen">
        <div className="App-logo">Loading...</div>
      </div>
    );
  }

  // Rendering podcast details once loaded
  return (
    <div className="PodcastDetailContainer" style={{ paddingTop: '50px' }}>
      <h2>{podcast.title}</h2>
      <img src={podcast.image} alt={podcast.title} className="PodcastDetailImage" />
      <div className="PodcastDetailDescription">{podcast.description}</div>

      {/* Season selector UI */}
      <div className="SeasonSelector">
        <button onClick={toggleSeasonDropdown} className="SeasonButton">
          {podcast.seasons[selectedSeason].title}
          <span className="DropdownArrow">{seasonDropdownOpen ? '▲' : '▼'}</span>
        </button>
        {/* Dropdown menu for selecting seasons */}
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

      {/* Displaying episodes of selected season */}
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
          {/* Mapping through episodes and displaying them */}
          {podcast.seasons[selectedSeason].episodes.length > 0 ? (
            podcast.seasons[selectedSeason].episodes.map((episode, index) => (
              <div
                key={episode.id}
                className="Episode"
                onClick={() => handleEpisodeSelect(episode)}
              >
                <span className="EpisodeNumber">{index + 1}.</span>
                <span className="EpisodeTitle">{episode.title}</span>
                {/* Button to favorite/unfavorite an episode */}
                <button
                  className="FavoriteButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(episode);
                  }}
                >
                  {isFavorite(episode.id) ? '💚' : '🤍'}
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

// Prop type validation for setCurrentEpisode function prop
PodcastDetail.propTypes = {
  setCurrentEpisode: PropTypes.func.isRequired,
};

export default PodcastDetail; // Exporting PodcastDetail component
