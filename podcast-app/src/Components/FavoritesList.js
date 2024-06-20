import React, { useState, useEffect, useMemo } from 'react';
import '../App.css';

// Component for managing and displaying a list of favorites
const FavoritesList = () => {
  const [storedFavorites, setStoredFavorites] = useState([]); // State for storing favorites
  const [titleFilter, setTitleFilter] = useState(''); // State for filtering favorites by title
  const [sortCriteria, setSortCriteria] = useState('recent'); // State for sorting criteria
  const [loading, setLoading] = useState(true); // State for loading indicator

  // Effect to fetch favorites from local storage on component mount
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

  // Function to format timestamp into a localized string
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Function to remove a favorite from the list
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

  // Memoized filtered list of favorites based on title filter
  const filteredFavorites = useMemo(() => {
    return storedFavorites.filter((fav) => {
      const matchesTitle =
        titleFilter === '' ||
        (fav.title && fav.title.toLowerCase().includes(titleFilter.toLowerCase()));
      return matchesTitle;
    });
  }, [storedFavorites, titleFilter]);

  // Memoized sorted list of favorites based on sorting criteria
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

  // Render loading screen while fetching data
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="App-logo">Loading...</div>
      </div>
    );
  }

  // Render favorites list once loaded
  return (
    <div className="FavoritesListContainer">
      <h2>Favorites List</h2>

      {/* Dropdown for sorting options */}
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

      {/* Input for filtering favorites by title */}
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

      {/* Displaying sorted and filtered favorites */}
      <div className="FavoritesList">
        {sortedFavorites.map((fav) => (
          <div key={`${fav.podcastId}-${fav.seasonId}-${fav.episodeId}`} className="FavoriteItem">
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

export default FavoritesList;
