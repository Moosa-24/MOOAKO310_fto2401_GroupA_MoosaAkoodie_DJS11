import React, { useState, useEffect } from 'react';
import { fetchPreviews } from '../services/Api';
import '../App.css';

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    fetchPreviews().then(setPodcasts);
  }, []);

  return (
    <div className="PodcastListContainer">
      <h2>Podcast List</h2>
      <div className="PodcastList">
        {podcasts.map(podcast => (
          <div key={podcast.id} className="PodcastItem">
            <img src={podcast.image} alt={podcast.title} className="PodcastItemImage" />
            <h3 className="PodcastItemTitle">{podcast.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastList;
