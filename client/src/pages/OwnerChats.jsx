import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import BookingCard from '../components/BookingCard';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';
import { MessageSquare } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/owner-dashboard')}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
              aria-label="Back to dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Guest Communications</h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">Manage conversations with your upcoming guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onClose={() => setError('')} />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loading message="Loading your communications..." />
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-3">No guest chats yet</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                When guests book your properties, their reservations will appear here so you can communicate with them directly to arrange their stay.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerChats;
