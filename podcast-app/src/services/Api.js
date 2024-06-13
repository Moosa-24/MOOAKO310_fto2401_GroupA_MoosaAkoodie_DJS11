const API_BASE_URL = 'https://podcast-api.netlify.app';

export const fetchPreviews = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    
    // Sort data alphabetically by title
    data.sort((a, b) => a.title.localeCompare(b.title));

    return data;
  } catch (error) {
    console.error('Error fetching previews:', error);
    throw error;
  }
};

export const fetchGenre = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/genre/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching genre ${id}:`, error);
    throw error;
  }
};

export const fetchShow = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/id/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching show ${id}:`, error);
    throw error;
  }
};
