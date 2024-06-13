import React, { useState, useEffect } from 'react';
import { fetchPreviews } from '../services/Api';

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    fetchPreviews().then(setPodcasts);
  }, []);

  return (
    <div>
      <h2>Podcast List</h2>
      <ul>
        {podcasts.map(podcast => (
          <li key={podcast.id}>
            {podcast.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PodcastList;