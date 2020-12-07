import axios from 'axios';
import config from '@/config/api';
const adminApi = axios.create({
  baseURL: config.adminApiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  createBuilding: (building) =>
    adminApi.post('building/new', building).then((response) => response.data),
  createLocation: (location) =>
    adminApi.post('location/new', location).then((response) => response.data),
};
