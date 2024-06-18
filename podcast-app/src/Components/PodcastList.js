import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPreviews } from '../services/Api';
import '../App.css';

const PodcastList = () => {
  // useState is used to manage state variables for the component
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true); // Tracks if the data is still loading
  const [sortBy, setSortBy] = useState('AZ'); // Default sorting order is A-Z
  const navigate = useNavigate(); // Hook for navigation

  // useEffect runs side-effects (like data fetching) after the component renders
  useEffect(() => {
    const fetchPodcastDetails = async () => {
      try {
        // Fetching preview data
        const data = await fetchPreviews();
        // Fetching detailed data for each podcast
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

        // Sort podcasts based on the selected sorting option
        const sortedPodcasts = sortPodcasts(podcastDetails, sortBy);
        setPodcasts(sortedPodcasts);
      } catch (error) {
        console.error('Error fetching podcast details:', error); // Log errors to the console
      } finally {
        setLoading(false); // Set loading to false once data fetching is done
      }
    };

    fetchPodcastDetails();
  }, [sortBy]); // Dependency array to re-run effect when sortBy changes

  // Function to sort podcasts based on different criteria
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

  // Navigate to podcast details page when a podcast is clicked
  const handlePodcastClick = (podcast) => {
    navigate(`/podcast/${podcast.id}`);
  };

  // Handle change in sort option
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Display loading message if data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the list of podcasts
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
