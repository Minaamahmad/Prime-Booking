import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelService, bookingService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';
import { Building2, Calendar, Users, CheckCircle, MessageCircle, RefreshCw, Edit, Sparkles } from 'lucide-react';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

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

      // Fetch all bookings for owner
      const bookingsResponse = await bookingService.getBookingsByOwner();
      setBookings(bookingsResponse.data);

      // Calculate stats
      let totalBookings = bookingsResponse.data.length;
      let pendingBookings = bookingsResponse.data.filter(
        (booking) => booking.status === 'Pending'
      ).length;
      let confirmedBookings = bookingsResponse.data.filter(
        (booking) => booking.status === 'Confirmed'
      ).length;

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

  const recomputeStats = (nextBookings, nextHotels) => {
    const safeBookings = Array.isArray(nextBookings) ? nextBookings : [];
    const safeHotels = Array.isArray(nextHotels) ? nextHotels : [];

    const pendingBookings = safeBookings.filter((b) => b.status === 'Pending').length;
    const confirmedBookings = safeBookings.filter((b) => b.status === 'Confirmed').length;

    setStats({
      totalHotels: safeHotels.length,
      totalBookings: safeBookings.length,
      pendingBookings,
      confirmedBookings,
    });
  };

  const handleApprove = async (bookingId) => {
    if (!bookingId) return;
    try {
      setError('');
      setActionLoadingId(bookingId);
      const res = await bookingService.approveBooking(bookingId);
      const updated = res?.data?.updatedBooking;

      setBookings((prev) => {
        const next = prev.map((b) => {
          if (b._id !== bookingId) return b;
          if (!updated) return { ...b, status: 'Confirmed' };
          return { ...b, ...updated };
        });
        recomputeStats(next, hotels);
        return next;
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve booking');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleChat = (bookingId) => {
    if (!bookingId) return;
    navigate(`/chat/${bookingId}`);
  };

  // Helper to generate status colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'checkedin':
      case 'checked in': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checkedout':
      case 'checked out': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      case 'new': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-7xl mx-auto">
          <div>
            <button
              onClick={() => navigate('/owner-dashboard')}
              className="text-gray-600 hover:text-gray-900 transition-colors mb-2 flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your properties and bookings</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchDashboardData()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
            <button
              onClick={() => navigate('/hotels')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Manage Properties
            </button>
          </div>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loading message="Loading dashboard..." />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Stats Grid */}
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Stat Card: Total Properties */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Properties</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-gray-900">{stats.totalHotels}</span>
                  </div>
                  <button
                    onClick={() => navigate('/hotels')}
                    className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    Manage Properties <span>→</span>
                  </button>
                </div>

                {/* Stat Card: Total Bookings */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Bookings</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-gray-900">{stats.totalBookings}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">All time bookings</span>
                  </div>
                </div>

                {/* Stat Card: Pending Bookings */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-gray-900">{stats.pendingBookings}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Awaiting approval</span>
                  </div>
                </div>

                {/* Stat Card: Confirmed Bookings */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirmed</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-gray-900">{stats.confirmedBookings}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Approved bookings</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="h-px bg-gray-200"></div>
          </div>

          {/* Guest Bookings Table */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Guest Bookings</h2>
                    <p className="text-gray-600 mt-1">Manage and approve guest bookings</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b border-gray-200">
                        <th className="pb-4 px-2 font-bold text-left">Booking ID</th>
                        <th className="pb-4 px-2 font-bold text-left">Guest Name</th>
                        <th className="pb-4 px-2 font-bold text-left">Email</th>
                        <th className="pb-4 px-2 font-bold text-left">Room Type</th>
                        <th className="pb-4 px-2 font-bold text-left">Check In</th>
                        <th className="pb-4 px-2 font-bold text-left">Check Out</th>
                        <th className="pb-4 px-2 font-bold text-center">Status</th>
                        <th className="pb-4 px-2 font-bold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length > 0 ? (
                        bookings.map((booking) => (
                          <tr key={booking._id} className="text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-2 font-bold text-gray-600">
                              #{booking._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="py-4 px-2 flex items-center gap-3">
                              <img
                                src={`https://ui-avatars.com/api/?name=${booking.user_id?.name || 'Guest'}&background=6366F1&color=fff`}
                                alt="avatar"
                                className="w-8 h-8 rounded-full border border-gray-200"
                              />
                              <span className="font-semibold text-gray-900">{booking.user_id?.name || 'N/A'}</span>
                            </td>
                            <td className="py-4 px-2 text-gray-600">
                              {booking.user_id?.email || 'N/A'}
                            </td>
                            <td className="py-4 px-2 text-gray-700 font-semibold">
                              {booking.room_id?.type || 'N/A'}
                            </td>
                            <td className="py-4 px-2 text-gray-600">
                              {new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-4 px-2 text-gray-600">
                              {new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-4 px-2">
                              <span className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold border ${getStatusColor(booking.status)}`}>
                                {booking.status || 'Unknown'}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleChat(booking._id)}
                                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-600 hover:text-white transition-colors"
                                  title="Open chat"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                </button>
                                {booking.status === 'Pending' ? (
                                  <button
                                    onClick={() => handleApprove(booking._id)}
                                    disabled={actionLoadingId === booking._id}
                                    className="px-3 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                  >
                                    {actionLoadingId === booking._id ? 'Approving…' : 'Approve'}
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="py-12 text-center text-gray-400">
                            <div className="flex flex-col items-center">
                              <Sparkles className="w-12 h-12 text-gray-300 mb-3" />
                              <span>No bookings found.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;