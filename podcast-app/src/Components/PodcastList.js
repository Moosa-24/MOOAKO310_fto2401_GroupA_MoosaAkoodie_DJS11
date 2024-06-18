import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPreviews } from '../services/Api';
import '../App.css';

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('AZ'); // Default sort by A-Z
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
              genres: podcastData.genres || [],
            };
          })
        );

        // Apply sorting based on current sortBy state
        const sortedPodcasts = sortPodcasts(podcastDetails, sortBy);
        setPodcasts(sortedPodcasts);
      } catch (error) {
        console.error('Error fetching podcast details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastDetails();
  }, [sortBy]); // Fetch podcasts whenever sortBy changes

  const sortPodcasts = (podcasts, sortBy) => {
    switch (sortBy) {
      case 'AZ':
        return [...podcasts].sort((a, b) => a.title.localeCompare(b.title));
      case 'ZA':
        return [...podcasts].sort((a, b) => b.title.localeCompare(a.title));
      case 'NEW':
        return [...podcasts].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      case 'OLD':
        return [...podcasts].sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
      default:
        return podcasts;
    }
  };

  const handlePodcastClick = (podcast) => {
    navigate(`/podcast/${podcast.id}`);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="PodcastListContainer">
      <h2>Podcast List</h2>
      <div className="SortOptions">
        <label>Sort By:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="AZ">Title A-Z</option>
          <option value="ZA">Title Z-A</option>
          <option value="NEW">Newly Updated Shows</option>
          <option value="OLD">Oldest Updated Shows</option>
        </select>
      </div>
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
              <p className="PodcastItemGenres">Genres: {podcast.genres.length > 0 ? podcast.genres.join(', ') : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastList;
