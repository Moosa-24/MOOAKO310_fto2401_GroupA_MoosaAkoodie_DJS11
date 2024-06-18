import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const FavoritesList = ({ favorites }) => {
  const [storedFavorites, setStoredFavorites] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [sortCriteria, setSortCriteria] = useState('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Load favorites from localStorage
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

  const filteredFavorites = storedFavorites.filter((fav) => {
    const matchesTitle =
      titleFilter === '' ||
      (fav.title && fav.title.toLowerCase().includes(titleFilter.toLowerCase()));

    return matchesTitle;
  });

  const sortByTitleAZ = () => {
    const sortedFavorites = [...filteredFavorites].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setStoredFavorites(sortedFavorites);
    setSortCriteria('titleAZ');
  };

  const sortByTitleZA = () => {
    const sortedFavorites = [...filteredFavorites].sort((a, b) =>
      b.title.localeCompare(a.title)
    );
    setStoredFavorites(sortedFavorites);
    setSortCriteria('titleZA');
  };

  const sortByRecent = () => {
    const sortedFavorites = [...filteredFavorites].sort((a, b) =>
      b.timestamp - a.timestamp
    );
    setStoredFavorites(sortedFavorites);
    setSortCriteria('recent');
  };

  const sortByOldest = () => {
    const sortedFavorites = [...filteredFavorites].sort((a, b) =>
      a.timestamp - b.timestamp
    );
    setStoredFavorites(sortedFavorites);
    setSortCriteria('oldest');
  };

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
          onChange={(e) => {
            setSortCriteria(e.target.value);
            switch (e.target.value) {
              case 'titleAZ':
                sortByTitleAZ();
                break;
              case 'titleZA':
                sortByTitleZA();
                break;
              case 'recent':
                sortByRecent();
                break;
              case 'oldest':
                sortByOldest();
                break;
              default:
                break;
            }
          }}
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
        {filteredFavorites.map((fav, index) => (
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
