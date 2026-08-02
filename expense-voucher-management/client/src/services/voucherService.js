import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/vouchers',
  withCredentials: true,
});

export async function createVoucher(data) {
  const response = await api.post('/', data);
  return response.data;
}

export async function getVouchers() {
  const response = await api.get('/');
  return response.data;
}

export async function getVoucherById(id) {
  const response = await api.get(`/${id}`);
  return response.data;
}

export async function updateVoucher(id, data) {
  const response = await api.put(`/${id}`, data);
  return response.data;
}

export async function deleteVoucher(id) {
  const response = await api.delete(`/${id}`);
  return response.data;
}

export async function submitVoucher(id) {
  const response = await api.patch(`/${id}/submit`);
  return response.data;
}
