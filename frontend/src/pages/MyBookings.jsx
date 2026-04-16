import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../services/api';
import BookingCard from '../components/BookingCard';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Loading from '../components/Loading';
import '../styles/MyBookings.css';

const MyBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      setSuccess('Booking cancelled successfully!');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleChat = (bookingId) => {
    navigate(`/chat/${bookingId}`);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Home
        </button>
        <h1>My Bookings</h1>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />
      <SuccessAlert message={success} onClose={() => setSuccess('')} />

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({bookings.filter((b) => b.status === 'Pending').length})
        </button>
        <button
          className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({bookings.filter((b) => b.status === 'Confirmed').length})
        </button>
      </div>

      {loading ? (
        <Loading message="Loading bookings..." />
      ) : filteredBookings.length > 0 ? (
        <div className="bookings-container">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancelBooking}
              onChat={handleChat}
            />
          ))}
        </div>
      ) : (
        <div className="no-bookings">
          <h3>
            {filter === 'all'
              ? 'No bookings yet'
              : `No ${filter} bookings`}
          </h3>
          <p>Start exploring and book your favorite hotel!</p>
          <button onClick={() => navigate('/')} className="explore-btn">
            Explore Hotels
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
