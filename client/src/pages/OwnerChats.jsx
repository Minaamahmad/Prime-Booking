import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import BookingCard from '../components/BookingCard';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/owner-dashboard')}
              className="text-gray-600 hover:text-indigo-600 transition-colors"
              aria-label="Back to dashboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Guest Chats</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4">
            <ErrorAlert message={error} onClose={() => setError('')} />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loading message="Loading bookings..." />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
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
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <svg
                className="w-16 h-16 mx-auto text-indigo-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No guest chats yet</h3>
              <p className="text-sm text-gray-600">
                Guest conversations will appear here once someone books your property.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerChats;
