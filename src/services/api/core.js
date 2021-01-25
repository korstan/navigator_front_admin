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
  
  getPathPoints: (buildingId, level) =>
    coreApi
      .get('path/points', { params: { buildingId, level } })
      .then((response) => response.data),

  getPathPointLinks: (pointId) =>
  coreApi
    .get('path/links', { params: { pointId } })
    .then((response) => response.data),
};
