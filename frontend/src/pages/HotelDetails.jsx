import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelService, roomService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import '../styles/HotelDetails.css';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isOwner } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    check_in: '',
    check_out: '',
  });

  useEffect(() => {
    fetchHotelDetails();
  }, [id, fetchHotelDetails]);

  const fetchHotelDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const hotelResponse = await hotelService.getHotelById(id);
      setHotel(hotelResponse.data);

      // Try to fetch rooms if user is owner
      if (isAuthenticated() && isOwner()) {
        try {
          const roomsResponse = await roomService.getRoomsByHotel(id);
          setRooms(roomsResponse.data);
        } catch {
          // User doesn't own this hotel, fetch public rooms
          setRooms([]);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, isOwner]);

  const handleRoomSelect = (room) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setSelectedRoom(room);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setBookingDates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooking = async () => {
    if (!bookingDates.check_in || !bookingDates.check_out) {
      setError('Please select both check-in and check-out dates');
      return;
    }

    navigate('/my-bookings', {
      state: {
        roomId: selectedRoom._id,
        checkIn: bookingDates.check_in,
        checkOut: bookingDates.check_out,
      },
    });
  };

  if (loading) return <Loading message="Loading hotel details..." />;

  if (!hotel) {
    return (
      <div className="error-container">
        <h2>Hotel not found</h2>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="hotel-details-page">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back
      </button>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <div className="hotel-header">
        <div className="hotel-images">
          {hotel.images && hotel.images.length > 0 ? (
            <img src={hotel.images[0]} alt={hotel.name} className="main-image" />
          ) : (
            <div className="placeholder-image">No image available</div>
          )}
        </div>

        <div className="hotel-info">
          <h1>{hotel.name}</h1>
          <p className="location">📍 {hotel.location}</p>
          <p className="description">{hotel.description}</p>
          {hotel.owner_id && (
            <p className="owner">Managed by: {hotel.owner_id.name}</p>
          )}
        </div>
      </div>

      <div className="rooms-section">
        <h2>Available Rooms</h2>
        {rooms.length > 0 ? (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onSelect={handleRoomSelect}
              />
            ))}
          </div>
        ) : (
          <div className="no-rooms">
            <p>No rooms available for this hotel</p>
          </div>
        )}
      </div>

      {selectedRoom && (
        <div className="booking-modal-overlay" onClick={() => setSelectedRoom(null)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedRoom(null)}
            >
              ✕
            </button>

            <h3>Book {selectedRoom.type} Room</h3>
            <p>Price: ${selectedRoom.price_per_night} per night</p>

            <div className="booking-form">
              <div className="form-group">
                <label htmlFor="check_in">Check-in Date</label>
                <input
                  type="date"
                  id="check_in"
                  name="check_in"
                  value={bookingDates.check_in}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="check_out">Check-out Date</label>
                <input
                  type="date"
                  id="check_out"
                  name="check_out"
                  value={bookingDates.check_out}
                  onChange={handleDateChange}
                  min={bookingDates.check_in || new Date().toISOString().split('T')[0]}
                />
              </div>

              {bookingDates.check_in && bookingDates.check_out && (
                <div className="price-summary">
                  <p>
                    Nights: {Math.ceil(
                      (new Date(bookingDates.check_out) - new Date(bookingDates.check_in)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                  <p>
                    Total: $
                    {Math.ceil(
                      (new Date(bookingDates.check_out) - new Date(bookingDates.check_in)) /
                        (1000 * 60 * 60 * 24)
                    ) * selectedRoom.price_per_night}
                  </p>
                </div>
              )}

              <button
                className="confirm-btn"
                onClick={handleBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
