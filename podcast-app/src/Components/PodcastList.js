import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPreviews } from '../services/Api';
import '../App.css';

const PodcastList = ({ setCurrentPodcast }) => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchPreviews()
      .then((data) => {
        setPodcasts(data);
      })
      .finally(() => {
        setLoading(false); // Once data is fetched (success or error), set loading to false
      });
  }, []);

  const handlePodcastClick = (podcast) => {
    setCurrentPodcast(podcast);
    navigate(`/podcast/${podcast.id}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching data
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
            <h3 className="PodcastItemTitle">{podcast.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastList;
