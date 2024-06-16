import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchShow } from '../services/Api';
import '../App.css';

const PodcastDetail = ({ setCurrentPodcast }) => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null); // State for last updated date
  const [selectedSeason, setSelectedSeason] = useState(0); // State for currently selected season index
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false); // State for dropdown menu visibility

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        const data = await response.json();

        // Ensure podcastData.seasons is an array
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
        setCurrentPodcast(podcastDetails);
        setLastUpdated(data.updated); // Set lastUpdated from API response
      } catch (error) {
        console.error('Error fetching podcast details:', error);
      }
    };

    fetchPodcastDetails();
  }, [id, setCurrentPodcast]);

  const toggleSeasonDropdown = () => {
    setSeasonDropdownOpen(!seasonDropdownOpen);
  };

  const handleSeasonChange = (index) => {
    setSelectedSeason(index);
    setSeasonDropdownOpen(false); // Close dropdown after selecting a season
  };

  if (!podcast) {
    return (
      <div className="loading-screen">
        <div className="App-logo">Loading...</div>
      </div>
    );
  }

  return (
    <div className="PodcastDetailContainer">
      <h2>{podcast.title}</h2>
      <img src={podcast.image} alt={podcast.title} className="PodcastDetailImage" />
      <div className="PodcastDetailDescription">{podcast.description}</div>
      {lastUpdated && (
        <p>Last Updated: {new Date(lastUpdated).toLocaleDateString()}</p>
      )}

      {/* Season Selector */}
      <div className="SeasonSelector">
        <button
          onClick={toggleSeasonDropdown}
          className="SeasonButton"
        >
          {podcast.seasons[selectedSeason].title}
          <span className="DropdownArrow">{seasonDropdownOpen ? '▲' : '▼'}</span>
        </button>

        {/* Dropdown menu */}
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

      {/* Selected Season Content */}
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
          {podcast.seasons[selectedSeason].episodes.map((episode, index) => (
            <div key={episode.id} className="Episode">
              <span className="EpisodeNumber">{index + 1}.</span>
              <span className="EpisodeTitle">{episode.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastDetail;
