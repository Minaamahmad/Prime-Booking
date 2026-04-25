import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Images, MapPin, User } from 'lucide-react';
import { hotelService, roomService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Toast from '../components/Toast';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingDates, setBookingDates] = useState({ check_in: '', check_out: '' });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const hotelResponse = await hotelService.getHotelById(id);
        setHotel(hotelResponse.data);

        const roomsResponse = await roomService.getAvailableRoomsByHotel(id);
        setRooms(Array.isArray(roomsResponse.data) ? roomsResponse.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleRoomSelect = (room) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (room.total_stock === 0) return;
    setSelectedRoom(room);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setBookingDates((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    if (!selectedRoom) return setError('Please select a room first');
    if (!bookingDates.check_in || !bookingDates.check_out) return setError('Please select both check-in and check-out dates');
    if (bookingSubmitting) return;

    try {
      setBookingSubmitting(true);
      setError('');
      await bookingService.createBooking({
        room_id: selectedRoom._id,
        check_in: bookingDates.check_in,
        check_out: bookingDates.check_out,
      });
      setSuccess('Booking created successfully!');
      setToast({ message: 'Booking created! Redirecting...', type: 'success' });
      setSelectedRoom(null);
      setBookingDates({ check_in: '', check_out: '' });
      setTimeout(() => {
        navigate('/my-bookings', { state: { success: 'Booking created successfully!' } });
      }, 1200);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create booking';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const nights = useMemo(() => {
    if (!bookingDates.check_in || !bookingDates.check_out) return 0;
    const diffMs = new Date(bookingDates.check_out) - new Date(bookingDates.check_in);
    const result = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Number.isFinite(result) && result > 0 ? result : 0;
  }, [bookingDates.check_in, bookingDates.check_out]);
  const total = useMemo(() => (selectedRoom && nights ? nights * Number(selectedRoom.price_per_night || 0) : 0), [nights, selectedRoom]);

  if (loading) return <Loading message="Loading hotel details..." />;
  if (!hotel) return <div className="min-h-screen bg-gray-50 py-16 text-center text-gray-600">Hotel not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/')} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Back to hotels
        </button>

        <ErrorAlert message={error} onClose={() => setError('')} />
        <SuccessAlert message={success} onClose={() => setSuccess('')} />
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{hotel.name}</h1>
        {hotel.location ? (
          <p className="mt-2 flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-indigo-600" /> {hotel.location}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {hotel.images?.length ? (
            hotel.images.slice(0, 4).map((image, idx) => (
              <img
                key={`${image}-${idx}`}
                alt={`${hotel.name}-${idx}`}
                src={image.startsWith('http') ? image : `${API_BASE_URL}${image}`}
                className="aspect-[4/3] w-full rounded-xl object-cover shadow-md"
              />
            ))
          ) : (
            <div className="col-span-2 flex aspect-[4/3] items-center justify-center rounded-xl bg-gray-100 text-gray-500 sm:col-span-4">
              <Images className="mr-2 h-4 w-4 text-indigo-600" /> No images available
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-900">About this hotel</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                {hotel.description || 'No description provided.'}
              </p>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Available rooms</h2>
                <span className="rounded-full border border-gray-200 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
                  {rooms.length} room{rooms.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-4">
                {rooms.map((room) => {
                  const firstImage = room.images?.[0]
                    ? room.images[0].startsWith('http')
                      ? room.images[0]
                      : `${API_BASE_URL}${room.images[0]}`
                    : 'https://via.placeholder.com/240x180?text=Room';
                  const isSelected = selectedRoom?._id === room._id;
                  const isUnavailable = room.total_stock === 0;
                  return (
                    <button
                      key={room._id}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => handleRoomSelect(room)}
                      className={`flex w-full flex-col gap-4 rounded-xl border p-4 text-left transition sm:flex-row ${
                        isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'
                      } ${isUnavailable ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <img src={firstImage} alt={room.type} className="h-28 w-full rounded-lg object-cover sm:w-36" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-gray-900">{room.type}</h3>
                          <p className="text-sm font-bold text-indigo-600">PKR {Number(room.price_per_night || 0).toLocaleString()} / night</p>
                        </div>
                        <p className="mt-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                          {isUnavailable ? 'Unavailable' : isSelected ? 'Selected' : 'Tap to select'}
                        </p>
                      </div>
                    </button>
                  );
                })}
                {rooms.length === 0 ? <p className="text-sm text-gray-600">No rooms available right now.</p> : null}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-md lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-900">Reservation</h2>
            <p className="mt-1 text-sm text-gray-600">{selectedRoom ? `${selectedRoom.type} selected` : 'Select a room to continue'}</p>

            <div className="mt-4 grid gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-600" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={bookingDates.check_in} onChange={handleDateChange} name="check_in" type="date" min={todayIso} />
              </div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-600" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={bookingDates.check_out} onChange={handleDateChange} name="check_out" type="date" min={bookingDates.check_in || todayIso} />
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Nights</span>
                <span className="font-semibold">{nights || '--'}</span>
              </div>
              <div className="mt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>{selectedRoom && nights ? `PKR ${Number(total).toLocaleString()}` : '--'}</span>
              </div>
            </div>

            <button
              className="mt-5 w-full rounded-full bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              onClick={handleBooking}
              disabled={!selectedRoom || bookingSubmitting}
            >
              {bookingSubmitting ? 'Reserving...' : 'Reserve now'}
            </button>

            {hotel.owner_id && typeof hotel.owner_id === 'object' && hotel.owner_id.name ? (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{hotel.owner_id.name}</p>
                  <p className="text-xs text-gray-500">Host</p>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
