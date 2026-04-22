import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getJobs = async (skip = 0, limit = 100) => {
  const response = await api.get('/jobs', { params: { skip, limit } });
  return response.data;
};

export const filterJobs = async (filters) => {
  const response = await api.get('/jobs/filter', { params: filters });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const triggerScrape = async () => {
  const response = await api.post('/scrape');
  return response.data;
};

export const exportJobsUrl = `${API_URL}/export`;

export default api;
