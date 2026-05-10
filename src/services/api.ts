import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth APIs
export const loginAPI = (credentials: { email: string; password: string }) =>
  api.post('/auth/login', credentials);

export const registerAPI = (userData: { email: string; user_name: string; password: string; user_type: string }) =>
  api.post('/auth/register', userData);

// Device APIs
export const getDevicesAPI = () => api.get('/devices');
export const getDeviceAPI = (id: number) => api.get(`/devices/${id}`);
export const createDeviceAPI = (device: any) => api.post('/devices', device);
export const updateDeviceAPI = (id: number, device: any) => api.put(`/devices/${id}`, device);
export const deleteDeviceAPI = (id: number) => api.delete(`/devices/${id}`);

// Zone APIs
export const getZonesAPI = () => api.get('/zones');
export const getZoneAPI = (id: number) => api.get(`/zones/${id}`);
export const createZoneAPI = (zone: any) => api.post('/zones', zone);
export const updateZoneAPI = (id: number, zone: any) => api.put(`/zones/${id}`, zone);
export const deleteZoneAPI = (id: number) => api.delete(`/zones/${id}`);

// Sensor APIs
export const getSensorsAPI = () => api.get('/sensors');
export const getSensorDataAPI = (id: number) => api.get(`/sensors/${id}/data`);

// Threshold APIs
export const getThresholdsAPI = () => api.get('/thresholds');
export const createThresholdAPI = (threshold: any) => api.post('/thresholds', threshold);
export const updateThresholdAPI = (id: number, threshold: any) => api.put(`/thresholds/${id}`, threshold);
export const deleteThresholdAPI = (id: number) => api.delete(`/thresholds/${id}`);

// Schedule APIs
export const getSchedulesAPI = () => api.get('/schedules');
export const createScheduleAPI = (schedule: any) => api.post('/schedules', schedule);
export const updateScheduleAPI = (id: number, schedule: any) => api.put(`/schedules/${id}`, schedule);
export const deleteScheduleAPI = (id: number) => api.delete(`/schedules/${id}`);

// Activity Logs API
export const getActivityLogsAPI = (params?: Record<string, string>) => api.get('/activity-logs', { params });

// User Management APIs
export const getUsersAPI = () => api.get('/users');
export const createUserAPI = (user: any) => api.post('/users', user);
export const updateUserAPI = (id: number, user: any) => api.put(`/users/${id}`, user);
export const deleteUserAPI = (id: number) => api.delete(`/users/${id}`);

// Permission APIs
export const getPermissionsAPI = () => api.get('/permissions');
export const assignZonePermissionAPI = (data: { zone_id: number; user_id: number }) =>
  api.post('/permissions/assign-zone', data);
export const revokeZonePermissionAPI = (zoneId: number, userId: number) =>
  api.delete(`/permissions/zone/${zoneId}/user/${userId}`);

// Plant Type APIs
export const getPlantTypesAPI = () => api.get('/plant-types');
export const createPlantTypeAPI = (plantType: any) => api.post('/plant-types', plantType);
export const updatePlantTypeAPI = (id: number, plantType: any) => api.put(`/plant-types/${id}`, plantType);
export const deletePlantTypeAPI = (id: number) => api.delete(`/plant-types/${id}`);