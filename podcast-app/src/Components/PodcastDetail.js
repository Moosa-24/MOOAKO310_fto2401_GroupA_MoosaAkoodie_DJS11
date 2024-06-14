import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchShow } from '../services/Api';
import '../App.css';

const PodcastDetail = ({ setCurrentPodcast }) => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    fetchShow(id).then(data => {
      setPodcast(data);
      setCurrentPodcast(data);
    });
  }, [id, setCurrentPodcast]);

  if (!podcast) {
    return <div>Loading...</div>;
  }

  return (
    <div className="PodcastDetailContainer">
      <h2>{podcast.title}</h2>
      <img src={podcast.image} alt={podcast.title} className="PodcastDetailImage" />
      <div className="PodcastDetailDescription">{podcast.description}</div>
      <div className="PodcastSeasons">
        {podcast.seasons.map(season => (
          <div key={season.id} className="PodcastSeason">
            <h3>{season.title}</h3>
            <ul>
              {season.episodes.map(episode => (
                <li key={episode.id}>{episode.title}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastDetail;
