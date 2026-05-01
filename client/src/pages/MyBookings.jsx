import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Toast from '../components/Toast';
import Loading from '../components/Loading';

const MyBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.success || '');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [filter, setFilter] = useState('all'); // all, pending, confirmed
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
      setToast({ message: 'Booking cancelled!', type: 'success' });
      fetchBookings();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel booking';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleChat = (bookingId) => {
    navigate(`/chat/${bookingId}`);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    const status = (booking?.status || '').toString().toLowerCase();
    return status === filter.toLowerCase();
  });

  // Reusing the exact status color generator from your OwnerDashboard
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'text-emerald-600 bg-emerald-50';
      case 'checkedin':
      case 'checked in': return 'text-yellow-600 bg-yellow-50';
      case 'checkedout':
      case 'checked out': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-pink-600 bg-pink-50';
      case 'pending':
      case 'new': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="pb-page p-4 font-sans text-gray-800 md:p-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header Section matching Owner Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-gray-900 mb-2 flex items-center gap-2 transition-colors font-medium"
            >
              ← Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your stays, manage reservations, and chat with owners.
            </p>
          </div>

          <div className="bg-white rounded-2xl px-6 py-4 border border-gray-100 shadow-sm flex flex-col items-end">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">Total bookings</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />
        <SuccessAlert message={success} onClose={() => setSuccess('')} />
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />

        {/* Filters Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="inline-flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-white border border-gray-200 shadow-md">
            <button
              type="button"
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2 ${filter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => setFilter('all')}
            >
              All
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${filter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {bookings.length}
              </span>
            </button>
            <button
              type="button"
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2 ${filter === 'pending' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => setFilter('pending')}
            >
              Pending
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${filter === 'pending' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {bookings.filter((b) => b.status === 'Pending').length}
              </span>
            </button>
            <button
              type="button"
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2 ${filter === 'confirmed' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${filter === 'confirmed' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {bookings.filter((b) => b.status === 'Confirmed').length}
              </span>
            </button>
          </div>

          {!loading && filteredBookings.length > 0 && (
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{filteredBookings.length}</span>{' '}
              {filter === 'all' ? 'bookings' : `${filter} bookings`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading message="Loading bookings..." />
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBookings.map((booking) => {
              const hotel = booking?.hotel_id && typeof booking.hotel_id === 'object' ? booking.hotel_id : null;
              const room = booking?.room_id && typeof booking.room_id === 'object' ? booking.room_id : null;
              const rawImage = hotel?.images?.[0];
              const imageUrl =
                typeof rawImage === 'string' && rawImage.length > 0
                  ? rawImage.startsWith('http')
                    ? rawImage
                    : `${API_BASE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
                  : null;

              // Extract dates & calculate nights (server fields: check_in / check_out)
              const checkIn = booking?.check_in ? new Date(booking.check_in) : null;
              const checkOut = booking?.check_out ? new Date(booking.check_out) : null;
              const nights =
                checkIn &&
                  checkOut &&
                  !Number.isNaN(checkIn.getTime()) &&
                  !Number.isNaN(checkOut.getTime())
                  ? Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)))
                  : 1;

              const totalPriceRaw = booking?.total_price ?? 0;
              const totalPrice = typeof totalPriceRaw === 'number' ? totalPriceRaw : Number(totalPriceRaw) || 0;
              const pricePerNight = room?.price_per_night ?? totalPrice / nights;
              const pricePerNightNumber = typeof pricePerNight === 'number' ? pricePerNight : Number(pricePerNight) || 0;

              return (
                <div key={booking._id} className="flex flex-col overflow-hidden rounded-[24px] bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">

                  {/* Property Image */}
                  <div className="h-52 w-full bg-gray-100">
                    <img
                      src={imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt="Property"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  {/* Header Section */}
                  <div className="border-b border-gray-100 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {hotel?.name || 'Hotel'}
                        </h2>
                        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {hotel?.location || 'Location not specified'}
                        </div>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                          Room type: <span className="text-gray-900 font-bold">{room?.type || 'N/A'}</span>
                        </p>
                      </div>

                      {/* Status indicator applying OwnerDashboard colors */}
                      <div className={`rounded-full px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status || 'Pending'}
                      </div>
                    </div>
                  </div>

                  {/* Price Details Section */}
                  <div className="border-b border-gray-100 p-6">
                    <h3 className="mb-4 text-[15px] font-bold text-gray-900">Price details</h3>
                    <div className="space-y-3 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          ${pricePerNightNumber.toFixed(2)} x {nights} {nights === 1 ? 'night' : 'nights'}
                        </span>
                        <span className="font-semibold text-gray-800">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Dates</span>
                        <span className="font-semibold text-gray-800">
                          {checkIn && !Number.isNaN(checkIn.getTime())
                            ? checkIn.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                            : '—'}{' '}
                          -{' '}
                          {checkOut && !Number.isNaN(checkOut.getTime())
                            ? checkOut.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total Section */}
                  <div className="border-b border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="p-6">
                    <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-5">
                      <div className="mb-1.5 flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h4 className="text-sm font-bold text-gray-900">Manage booking</h4>
                      </div>
                      <p className="mb-5 text-[13px] text-gray-500 font-medium leading-relaxed">
                        Need help with this reservation? Reach out to the owner or cancel your stay.
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleChat(booking._id)}
                          className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-[13px] font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        >
                          Chat Owner
                        </button>

                        {booking.status?.toLowerCase() !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="flex-1 rounded-xl bg-red-600 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-red-700"
                          >
                            Cancel Stay
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-3xl shadow-inner">
              🧳
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {filter === 'all'
                ? 'Start exploring and book your favorite hotel. Your reservations will show up here.'
                : 'Try switching filters to view bookings in other states.'}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate('/')}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Explore hotels
              </button>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  View all bookings
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;