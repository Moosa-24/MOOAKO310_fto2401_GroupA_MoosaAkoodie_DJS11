/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';

const PodcastDetail = ({ setCurrentPodcast = () => {}, setCurrentEpisode }) => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [progressBarAnimating, setProgressBarAnimating] = useState(false);

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
        setCurrentPodcast(podcastDetails);
        setLastUpdated(data.updated);
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
    setSeasonDropdownOpen(false);
  };

  const handleEpisodeSelect = (episode) => {
    setProgressBarAnimating(true);
    setTimeout(() => {
      setProgressBarAnimating(false);
      setCurrentEpisode(episode);
    }, 500); // Assuming 500ms animation duration
  };

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
      {lastUpdated && (
        <p>Last Updated: {new Date(lastUpdated).toLocaleDateString()}</p>
      )}

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

export default PodcastDetail;