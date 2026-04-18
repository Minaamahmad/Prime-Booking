import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Loading from '../components/Loading';
import '../styles/RoomManagement.css';

const RoomManagement = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Single',
    price_per_night: '',
    total_stock: '',
  });

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await roomService.getRoomsByHotel(hotelId);
      setRooms(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchRooms();
  }, [hotelId, fetchRooms]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.price_per_night || !formData.total_stock) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingRoom) {
        await roomService.updateRoom(hotelId, editingRoom._id, formData);
        setSuccess('Room updated successfully!');
      } else {
        await roomService.createRoom(hotelId, formData);
        setSuccess('Room created successfully!');
      }
      setFormData({ type: 'Single', price_per_night: '', total_stock: '' });
      setEditingRoom(null);
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      type: room.type,
      price_per_night: room.price_per_night,
      total_stock: room.total_stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await roomService.deleteRoom(hotelId, roomId);
      setSuccess('Room deleted successfully!');
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleCancel = () => {
    setEditingRoom(null);
    setFormData({ type: 'Single', price_per_night: '', total_stock: '' });
    setShowForm(false);
  };

  return (
    <div className="room-management-page">
      <div className="management-header">
        <button onClick={() => navigate('/owner-dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Room Management</h1>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />
      <SuccessAlert message={success} onClose={() => setSuccess('')} />

      <button
        className="add-room-btn"
        onClick={() => {
          handleCancel();
          setShowForm(!showForm);
        }}
      >
        {showForm ? '✕ Cancel' : '+ Add New Room'}
      </button>

      {showForm && (
        <form className="room-form" onSubmit={handleSubmit}>
          <h3>{editingRoom ? 'Edit Room' : 'Create New Room'}</h3>

          <div className="form-group">
            <label htmlFor="type">Room Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price_per_night">Price per Night ($) *</label>
            <input
              type="number"
              id="price_per_night"
              name="price_per_night"
              value={formData.price_per_night}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="total_stock">Total Rooms Available *</label>
            <input
              type="number"
              id="total_stock"
              name="total_stock"
              value={formData.total_stock}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingRoom ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading message="Loading rooms..." />
      ) : rooms.length > 0 ? (
        <div className="rooms-list">
          {rooms.map((room) => (
            <div key={room._id} className="room-item">
              <div className="room-details">
                <h4>{room.type} Room</h4>
                <p>
                  Price: <strong>${room.price_per_night}</strong> per night
                </p>
                <p>
                  Available: <strong>{room.total_stock}</strong> rooms
                </p>
              </div>
              <div className="room-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(room)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(room._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-rooms">
          <p>No rooms yet. Create your first room!</p>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
