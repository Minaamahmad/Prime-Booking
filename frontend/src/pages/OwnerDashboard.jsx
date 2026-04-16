import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelService, bookingService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';
import '../styles/OwnerDashboard.css';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch hotels
      const hotelsResponse = await hotelService.getMyHotels();
      setHotels(hotelsResponse.data);

      // Calculate stats
      let totalBookings = 0;
      let pendingBookings = 0;
      let confirmedBookings = 0;

      // Fetch bookings for each hotel
      for (const hotel of hotelsResponse.data) {
        try {
          const bookingsResponse = await bookingService.getBookingsByHotel(
            hotel._id
          );
          totalBookings += bookingsResponse.data.length;
          pendingBookings += bookingsResponse.data.filter(
            (booking) => booking.status === 'Pending'
          ).length;
          confirmedBookings += bookingsResponse.data.filter(
            (booking) => booking.status === 'Confirmed'
          ).length;
        } catch {
          // Skip booking fetch for this hotel
        }
      }

      setStats({
        totalHotels: hotelsResponse.data.length,
        totalBookings,
        pendingBookings,
        confirmedBookings,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-dashboard-page">
      <div className="dashboard-header">
        <button onClick={() => navigate('/')} className="home-btn">
          ← Back to Home
        </button>
        <h1>Owner Dashboard</h1>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {loading ? (
        <Loading message="Loading dashboard..." />
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Hotels</h3>
              <p className="stat-number">{stats.totalHotels}</p>
              <button onClick={() => navigate('/hotels')}>Manage Hotels</button>
            </div>

            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-number">{stats.totalBookings}</p>
            </div>

            <div className="stat-card">
              <h3>Pending Bookings</h3>
              <p className="stat-number pending">{stats.pendingBookings}</p>
            </div>

            <div className="stat-card">
              <h3>Confirmed Bookings</h3>
              <p className="stat-number confirmed">{stats.confirmedBookings}</p>
            </div>
          </div>

          <div className="dashboard-actions">
            <button
              className="action-btn primary"
              onClick={() => navigate('/hotels')}
            >
              📝 Manage Hotels
            </button>
            <button
              className="action-btn secondary"
              onClick={() => fetchDashboardData()}
            >
              🔄 Refresh Data
            </button>
          </div>

          {hotels.length > 0 && (
            <div className="quick-hotels">
              <h2>Your Hotels</h2>
              <div className="hotels-quick-list">
                {hotels.map((hotel) => (
                  <div key={hotel._id} className="quick-hotel-card">
                    <h3>{hotel.name}</h3>
                    <p className="location">📍 {hotel.location}</p>
                    <button
                      onClick={() => navigate(`/rooms/${hotel._id}`)}
                      className="quick-action"
                    >
                      Manage Rooms
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
