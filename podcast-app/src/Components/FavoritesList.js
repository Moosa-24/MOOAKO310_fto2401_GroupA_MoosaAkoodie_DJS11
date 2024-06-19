/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const FavoritesList = () => {
  const [storedFavorites, setStoredFavorites] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [sortCriteria, setSortCriteria] = useState('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setStoredFavorites(storedFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const removeFromFavorites = (favorite) => {
    const updatedFavorites = storedFavorites.filter(
      (fav) =>
        !(
          fav.podcastId === favorite.podcastId &&
          fav.seasonId === favorite.seasonId &&
          fav.episodeId === favorite.episodeId
        )
    );
    setStoredFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filteredFavorites = useMemo(() => {
    return storedFavorites.filter((fav) => {
      const matchesTitle =
        titleFilter === '' ||
        (fav.title && fav.title.toLowerCase().includes(titleFilter.toLowerCase()));
      return matchesTitle;
    });
  }, [storedFavorites, titleFilter]);

  const sortedFavorites = useMemo(() => {
    let sortedFavorites;
    switch (sortCriteria) {
      case 'titleAZ':
        sortedFavorites = [...filteredFavorites].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
      case 'titleZA':
        sortedFavorites = [...filteredFavorites].sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;
      case 'recent':
        sortedFavorites = [...filteredFavorites].sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        break;
      case 'oldest':
        sortedFavorites = [...filteredFavorites].sort((a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        break;
      default:
        sortedFavorites = filteredFavorites;
        break;
    }
    return sortedFavorites;
  }, [filteredFavorites, sortCriteria]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="App-logo">Loading...</div>
      </div>
    );
  }

  return (
    <div className="FavoritesListContainer">
      <h2>Favorites List</h2>

      <div className="SortOptions">
        <label>Sort By:</label>
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="titleAZ">Title A-Z</option>
          <option value="titleZA">Title Z-A</option>
          <option value="recent">Most Recent</option>
          <option value="oldest">Furthest Back</option>
        </select>
      </div>

      <div className="Filters">
        <label>
          Title Filter:
          <input
            type="text"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </label>
      </div>

      <div className="FavoritesList">
        {sortedFavorites.map((fav, index) => (
          <div key={index} className="FavoriteItem">
            <div>Title: {fav.title}</div>
            <div>Show: {fav.showTitle}</div>
            <div>Season: {fav.seasonTitle}</div>
            <div>Added: {formatDate(fav.timestamp)}</div>
            <button onClick={() => removeFromFavorites(fav)}>
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

FavoritesList.propTypes = {
  favorites: PropTypes.array.isRequired,
};

export default FavoritesList;
