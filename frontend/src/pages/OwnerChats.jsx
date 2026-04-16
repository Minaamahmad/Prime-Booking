import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import BookingCard from '../components/BookingCard';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';
import '../styles/OwnerChats.css';

const OwnerChats = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getBookingsByOwner();
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load owner bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (bookingId) => {
    navigate(`/chat/${bookingId}`);
  };

  return (
    <div className="owner-chats-page">
      <div className="owner-chats-header">
        <button className="back-btn" onClick={() => navigate('/owner-dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Owner Chats</h1>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {loading ? (
        <Loading message="Loading owner bookings..." />
      ) : bookings.length > 0 ? (
        <div className="owner-chats-list">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              isOwner={true}
              onChat={handleChat}
            />
          ))}
        </div>
      ) : (
        <div className="empty-owner-chats">
          <h3>No bookings yet</h3>
          <p>No active guest chats are available until a guest books one of your rooms.</p>
        </div>
      )}
    </div>
  );
};

export default OwnerChats;
