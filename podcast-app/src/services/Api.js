const API_BASE_URL = 'https://podcast-api.netlify.app';

export const fetchPreviews = async () => {
  const response = await fetch(`${API_BASE_URL}`);
  const data = await response.json();
  return data;
};

export const fetchGenre = async (id) => {
  const response = await fetch(`${API_BASE_URL}/genre/${id}`);
  const data = await response.json();
  return data;
};

export const fetchShow = async (id) => {
  const response = await fetch(`${API_BASE_URL}/id/${id}`);
  const data = await response.json();
  return data;
};
