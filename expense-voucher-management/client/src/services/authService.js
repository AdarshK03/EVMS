import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export async function login(email, password) {
  const response = await api.post('/login', { email, password });
  return response.data;
}

export async function logout() {
  const response = await api.post('/logout');
  return response.data;
}

export async function getMe() {
  const response = await api.get('/me');
  return response.data;
}
