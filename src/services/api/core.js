import axios from 'axios';
import config from '@/config/api';
const coreApi = axios.create({
  baseURL: config.coreApiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getBuildings: () =>
    coreApi.get('building/all').then((response) => response.data),
  getLevels: (buildingId) =>
    coreApi
      .get('level', { params: { buildingId } })
      .then((response) => response.data),
};
