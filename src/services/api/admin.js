import axios from 'axios';
import config from '@/config/api';
const adminApi = axios.create({
  baseURL: config.adminApiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // building
  createBuilding: (building) =>
    adminApi.post('building/new', building).then((response) => response.data),
  updateBuilding: (building) =>
    adminApi.put(`building/${building.id}/edit`, building).then((response) => response.data),
  removeBuilding: (id) =>
    adminApi.delete(`building/${id}/remove`).then((response) => response.data),

  // location
  createLocation: (location) =>
    adminApi.post('location/new', location).then((response) => response.data),
  updateLocation: (location) =>
    adminApi.put(`location/${location.id}/edit`, location).then((response) => response.data),
  removeLocation: (id) =>
    adminApi.delete(`location/${id}/remove`).then((response) => response.data),
};
