import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPreviews } from '../services/Api';
import '../App.css';

const PodcastList = ({ setCurrentPodcast }) => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      try {
        const data = await fetchPreviews();
        const podcastDetails = await Promise.all(
          data.map(async (podcast) => {
            const response = await fetch(`https://podcast-api.netlify.app/id/${podcast.id}`);
            const podcastData = await response.json();
            return {
              ...podcast,
              seasons: podcastData.seasons.length,
              genres: podcastData.genres || [], // Ensure genres is defined as an array
            };
          })
        );
        setPodcasts(podcastDetails);
      } catch (error) {
        console.error('Error fetching podcast details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastDetails();
  }, []);

  const handlePodcastClick = (podcast) => {
    setCurrentPodcast(podcast);
    navigate(`/podcast/${podcast.id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="PodcastListContainer">
      <h2>Podcast List</h2>
      <div className="PodcastList">
        {podcasts.map((podcast) => (
          <div
            key={podcast.id}
            className="PodcastItem"
            onClick={() => handlePodcastClick(podcast)}
          >
            <img src={podcast.image} alt={podcast.title} className="PodcastItemImage" />
            <div className="PodcastDetails">
              <h3 className="PodcastItemTitle">{podcast.title}</h3>
              <p className="PodcastItemSeasons">Seasons: {podcast.seasons}</p>
              {/* Removed the section displaying last updated date */}
              <p className="PodcastItemGenres">Genres: {podcast.genres.length > 0 ? podcast.genres.join(', ') : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastList;
