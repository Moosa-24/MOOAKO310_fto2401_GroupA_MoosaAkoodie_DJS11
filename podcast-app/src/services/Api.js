const API_BASE_URL = 'https://podcast-api.netlify.app';

// Function to fetch previews of podcasts
export const fetchPreviews = async () => {
  try {
    const response = await fetch(API_BASE_URL); // Make a request to the API
    const data = await response.json(); // Parse the response as JSON
    
    // Check if the response is an array (expected structure)
    if (!Array.isArray(data)) {
      throw new Error('Unexpected data structure for previews');
    }

    // Sort the podcast previews alphabetically by their title
    data.sort((a, b) => a.title.localeCompare(b.title));

    return data; // Return the sorted data
  } catch (error) {
    console.error('Error fetching previews:', error); 
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

// Function to fetch details of a specific genre by its ID
export const fetchGenre = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/genre/${id}`); // API - genre ID
    const data = await response.json(); 
    return data; // Return the genre data
  } catch (error) {
    console.error(`Error fetching genre ${id}:`, error); 
    throw error; 
  }
};

// Function to fetch details of a specific show by its ID
export const fetchShow = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/id/${id}`); // API - show ID
    const data = await response.json(); 
    return data; // Return the show data
  } catch (error) {
    console.error(`Error fetching show ${id}:`, error); 
    throw error; 
  }
};
