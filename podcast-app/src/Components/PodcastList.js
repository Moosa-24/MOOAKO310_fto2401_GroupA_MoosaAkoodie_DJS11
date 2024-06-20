import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { fetchPreviews } from '../services/Api'; // Import API function
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../App.css';

const PodcastList = () => {
  // State hooks for managing podcasts, loading state, sorting and filtering
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('AZ'); // Default sorting by title A-Z
  const [titleFilter, setTitleFilter] = useState(''); // State for title filter
  const navigate = useNavigate(); // Navigation hook for routing

  useEffect(() => {
    // Effect hook to fetch podcast details and update state
    const fetchPodcastDetails = async () => {
      try {
        const data = await fetchPreviews(); // Fetching preview data
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

        const sortedPodcasts = sortPodcasts(podcastDetails, sortBy); // Sorting fetched podcasts
        setPodcasts(sortedPodcasts); // Updating podcasts state
      } catch (error) {
        console.error('Error fetching podcast details:', error); // Error handling
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchPodcastDetails(); // Fetch podcasts when component mounts or sortBy changes
  }, [sortBy]); // Depend on sortBy to refetch when sorting changes

  // Function to sort podcasts based on selected criteria
  const sortPodcasts = (podcasts, sortBy) => {
    switch (sortBy) {
      case 'AZ':
        return [...podcasts].sort((a, b) => a.title.localeCompare(b.title)); // Sort by title A-Z
      case 'ZA':
        return [...podcasts].sort((a, b) => b.title.localeCompare(a.title)); // Sort by title Z-A
      case 'NEW':
        return [...podcasts].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)); // Sort by newest
      case 'OLD':
        return [...podcasts].sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated)); // Sort by oldest
      default:
        return podcasts;
    }
  };

  // Click handler for navigating to podcast details
  const handlePodcastClick = (podcast) => {
    navigate(`/podcast/${podcast.id}`);
  };

  // Event handler for sorting change
  const handleSortChange = (event) => {
    setSortBy(event.target.value); // Update sortBy state
  };

  // Event handler for title filter change
  const handleTitleFilterChange = (event) => {
    setTitleFilter(event.target.value); // Update titleFilter state
  };

  // Filtering podcasts based on title filter input
  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(titleFilter.toLowerCase())
  );

  // Settings for the carousel displaying podcast previews
  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Rendering loading state while fetching data
  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  // Rendering the main PodcastList component once data is loaded
  return (
    <div className="PodcastListContainer">
      <h2>Podcast List</h2>

      {/* Carousel for displaying podcast previews */}
      <div className="CarouselContainer">
        <Slider {...carouselSettings}>
          {podcasts.slice(0, 10).map((podcast) => (
            <div key={podcast.id} className="CarouselItem" onClick={() => handlePodcastClick(podcast)}>
              <img src={podcast.image} alt={podcast.title} className="CarouselItemImage" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Sort and filter options */}
      <div className="SortOptions">
        <label>Sort By:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="AZ">Title A-Z</option>
          <option value="ZA">Title Z-A</option>
          <option value="NEW">Newly Updated Shows</option>
          <option value="OLD">Oldest Updated Shows</option>
        </select>

        <label>Title Filter:</label>
        <input
          type="text"
          value={titleFilter}
          onChange={handleTitleFilterChange}
        />
      </div>

      {/* List of podcasts */}
      <div className="PodcastList">
        {filteredPodcasts.map((podcast) => (
          <div
            key={podcast.id}
            className="PodcastItem"
            onClick={() => handlePodcastClick(podcast)}
          >
            <img src={podcast.image} alt={podcast.title} className="PodcastItemImage" />
            <div className="PodcastDetails">
              <h3 className="PodcastItemTitle">{podcast.title}</h3>
              <p className="PodcastItemSeasons">Seasons: {podcast.seasons}</p>
              <p className="PodcastItemGenres">
                Genres: {podcast.genres.length > 0 ? podcast.genres.join(', ') : 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastList;
