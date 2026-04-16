import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  googleLogin: (token) => api.post('/auth/google', { token }),
  demoLogin: (data) => api.post('/auth/demo', data),
  logout: () => api.post('/auth/logout'),
};

// Hotel Services
export const hotelService = {
  // Public endpoints (no auth required)
  getAllHotels: () => api.get('/v1/hotels'),
  getHotelById: (id) => api.get(`/v1/hotels/${id}`),
  
  // Owner endpoints (requires auth)
  getMyHotels: () => api.get('/v1/hotels/my-hotels'),
  createHotel: (data) => api.post('/v1/hotels', data),
  updateHotel: (id, data) => api.put(`/v1/hotels/${id}`, data),
  deleteHotel: (id) => api.delete(`/v1/hotels/${id}`),
  uploadHotelImages: (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post(`/v1/hotels/${id}/upload-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Room Services
export const roomService = {
  getRoomsByHotel: (hotelId) => api.get(`/v1/rooms/${hotelId}`),
  getRoom: (hotelId, roomId) => api.get(`/v1/rooms/${hotelId}/${roomId}`),
  createRoom: (hotelId, data) => api.post(`/v1/rooms/${hotelId}`, data),
  updateRoom: (hotelId, roomId, data) => api.put(`/v1/rooms/${hotelId}/${roomId}`, data),
  deleteRoom: (hotelId, roomId) => api.delete(`/v1/rooms/${hotelId}/${roomId}`),
  uploadRoomImages: (hotelId, roomId, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post(`/v1/rooms/${hotelId}/${roomId}/upload-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Message Services
export const messageService = {
  getMessagesByBooking: (bookingId) => api.get(`/v1/messages/booking/${bookingId}`),
  sendMessage: (bookingId, content) => api.post(`/v1/messages/booking/${bookingId}`, { content }),
};

// Booking Services
export const bookingService = {
  createBooking: (data) => api.post('/v1/bookings', data),
  getMyBookings: () => api.get('/v1/bookings'),
  getBookingsByHotel: (hotelId) => api.get(`/v1/bookings/hotel/${hotelId}`),
  getBookingsByOwner: () => api.get('/v1/bookings/owner'),
  approveBooking: (id) => api.put(`/v1/bookings/${id}/approve`),
  cancelBooking: (id) => api.delete(`/v1/bookings/${id}`),
};

export default api;
