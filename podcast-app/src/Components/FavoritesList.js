import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

// This component displays and manages a list of favorite items
const FavoritesList = ({ favorites }) => {
  // State variables to manage the list of favorites, the title filter, and the sorting criteria
  const [storedFavorites, setStoredFavorites] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [sortCriteria, setSortCriteria] = useState('recent'); // Default sort by most recent

  // useEffect hook runs when the component mounts, loading favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setStoredFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Helper function to format a timestamp into a human-readable date and time
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Convert timestamp to human-readable format
  };

  // Function to remove a favorite item from the list and update localStorage
  const removeFromFavorites = (favorite) => {
    const updatedFavorites = storedFavorites.filter(
      (fav) =>
        !(
          fav.podcastId === favorite.podcastId &&
          fav.seasonId === favorite.seasonId &&
          fav.episodeId === favorite.episodeId
        )
    );
    // Update the state and save the updated list to localStorage
    setStoredFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Filter the favorites based on the title input by the user
  const filteredFavorites = storedFavorites.filter((fav) => {
    // Check if the favorite's title matches the filter input
    const matchesTitle =
      titleFilter === '' || // If the filter is empty, all items match
      (fav.title && fav.title.toLowerCase().includes(titleFilter.toLowerCase()));

    return matchesTitle;
  });

  // Sorting Functions to sort the filtered list of favorites based on different criteria
  const sortByTitleAZ = () => {
    const sortedFavorites = [...filteredFavorites].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setStoredFavorites(sortedFavorites); // Update state with sorted list
    setSortCriteria('titleAZ'); // Update the sort criteria
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

  return (
    <div className="FavoritesListContainer">
      <h2>Favorites List</h2>

      {/* Sorting Controls: Allow user to select how to sort the favorites list */}
      <div className="SortOptions">
        <label>Sort By:</label>
        <select
          value={sortCriteria} // The current sort criteria
          onChange={(e) => {
            // When the user changes the sorting option
            setSortCriteria(e.target.value); // Update the sort criteria
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

      {/* Filters: Allow user to filter favorites by title */}
      <div className="Filters">
        <label>
          Title Filter:
          <input
            type="text"
            value={titleFilter} // The current value of the title filter input
            onChange={(e) => setTitleFilter(e.target.value)} // Update the title filter when the user types
          />
        </label>
      </div>

      {/* List of Favorites: Display the filtered and sorted list of favorites */}
      <div className="FavoritesList">
        {filteredFavorites.map((fav, index) => (
          <div key={index} className="FavoriteItem">
            <div>Title: {fav.title}</div>
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

// Define the expected prop types for this component
FavoritesList.propTypes = {
  favorites: PropTypes.array.isRequired, // favorites is required and should be an array
};

export default FavoritesList;
