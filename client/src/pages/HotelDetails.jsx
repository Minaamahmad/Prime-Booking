import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelService, roomService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';

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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchHotelDetails = async () => {
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
    };

    fetchHotelDetails();
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
    if (!selectedRoom) {
      setError('Please select a room first');
      return;
    }
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
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-primary-coral mb-4">Hotel not found</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-teal text-white px-6 py-2 rounded-lg hover:bg-primary-teal/90 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-primary-teal hover:text-primary-teal/80 font-medium flex items-center gap-2"
      >
        ← Back
      </button>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          {hotel.images && hotel.images.length > 0 ? (
            <div className="space-y-4">
              {/* Main image */}
              <img
                src={`${API_BASE_URL}${hotel.images[0]}`}
                alt={hotel.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              
              {/* Image gallery */}
              {hotel.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {hotel.images.slice(1, 5).map((image, index) => (
                    <img
                      key={index}
                      src={`${API_BASE_URL}${image}`}
                      alt={`${hotel.name} ${index + 2}`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        // You could implement a lightbox here
                        console.log('Image clicked:', image);
                      }}
                    />
                  ))}
                  {hotel.images.length > 5 && (
                    <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                      +{hotel.images.length - 5} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-primary-charcoal">{hotel.name}</h1>
          <p className="text-primary-charcoal/70 flex items-center gap-2">
            📍 {hotel.location}
          </p>
          <p className="text-primary-charcoal/80">{hotel.description}</p>
          {hotel.owner_id && typeof hotel.owner_id === 'object' && hotel.owner_id.name && (
            <p className="text-primary-charcoal/60">Managed by: {hotel.owner_id.name}</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-primary-charcoal mb-4">Available Rooms</h2>
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onSelect={handleRoomSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-primary-charcoal/70">
            <p>No rooms available for this hotel</p>
          </div>
        )}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedRoom(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setSelectedRoom(null)}
            >
              ✕
            </button>

            <h3>Book {selectedRoom?.type} Room</h3>
            <p>Price: ${selectedRoom?.price_per_night} per night</p>

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

              {bookingDates.check_in && bookingDates.check_out && selectedRoom && (
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
