import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Loading from '../components/Loading';
import '../styles/HotelManagement.css';

const HotelManagement = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingHotel, setEditingHotel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await hotelService.getMyHotels();
      setHotels(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      setError('Name and location are required');
      return;
    }

    try {
      if (editingHotel) {
        await hotelService.updateHotel(editingHotel._id, formData);
        setSuccess('Hotel updated successfully!');
      } else {
        await hotelService.createHotel(formData);
        setSuccess('Hotel created successfully!');
      }
      setFormData({ name: '', location: '', description: '' });
      setEditingHotel(null);
      setShowForm(false);
      fetchHotels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save hotel');
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) {
      return;
    }

    try {
      await hotelService.deleteHotel(hotelId);
      setSuccess('Hotel deleted successfully!');
      fetchHotels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete hotel');
    }
  };

  const handleCancel = () => {
    setEditingHotel(null);
    setFormData({ name: '', location: '', description: '' });
    setShowForm(false);
  };

  return (
    <div className="hotel-management-page">
      <div className="management-header">
        <button onClick={() => navigate('/owner-dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Hotel Management</h1>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />
      <SuccessAlert message={success} onClose={() => setSuccess('')} />

      <button
        className="add-hotel-btn"
        onClick={() => {
          handleCancel();
          setShowForm(!showForm);
        }}
      >
        {showForm ? '✕ Cancel' : '+ Add New Hotel'}
      </button>

      {showForm && (
        <form className="hotel-form" onSubmit={handleSubmit}>
          <h3>{editingHotel ? 'Edit Hotel' : 'Create New Hotel'}</h3>

          <div className="form-group">
            <label htmlFor="name">Hotel Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingHotel ? 'Update Hotel' : 'Create Hotel'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading message="Loading hotels..." />
      ) : hotels.length > 0 ? (
        <div className="hotels-list">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="hotel-item">
              <div className="hotel-details">
                <h3>{hotel.name}</h3>
                <p className="location">📍 {hotel.location}</p>
                <p className="description">{hotel.description}</p>
                {hotel.images && hotel.images.length > 0 && (
                  <p className="images-count">📷 {hotel.images.length} images</p>
                )}
              </div>
              <div className="hotel-actions">
                <button
                  className="manage-rooms-btn"
                  onClick={() => navigate(`/rooms/${hotel._id}`)}
                >
                  🚪 Manage Rooms
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(hotel)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(hotel._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-hotels">
          <p>No hotels yet. Create your first hotel!</p>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
