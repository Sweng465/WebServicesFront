import axios from 'axios';

const user = JSON.parse(localStorage.getItem('user'));

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    Authorization: user ? `Bearer ${user.token}` : ''
  }
});

export const getProtectedData = async () => {
  const res = await api.get('/protected');
  return res.data;
};