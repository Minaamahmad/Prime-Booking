import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelService, bookingService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';

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
  },[]);

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

  // Helper to generate dynamic status pill colors based on the reference image
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'text-emerald-500 bg-emerald-50';
      case 'checkedin': 
      case 'checked in': return 'text-yellow-600 bg-yellow-50';
      case 'checkedout':
      case 'checked out': return 'text-blue-500 bg-blue-50';
      case 'cancelled': return 'text-pink-500 bg-pink-50';
      case 'pending':
      case 'new': return 'text-purple-500 bg-purple-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-gray-800 p-4 md:p-8 font-sans">
      
      {/* Header & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <button 
            onClick={() => navigate('/')} 
            className="text-sm text-gray-500 hover:text-gray-900 mb-2 flex items-center gap-2 transition-colors font-medium"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
            onClick={() => fetchDashboardData()}
          >
            🔄 Refresh Data
          </button>
          <button
            className="px-5 py-2.5 bg-[#0B0F19] text-white font-medium rounded-xl shadow-sm hover:bg-black transition-all flex items-center gap-2"
            onClick={() => navigate('/hotels')}
          >
            📝 Manage Hotels
          </button>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loading message="Loading dashboard..." />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          
          {/* Dashboard Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat Card: Total Hotels */}
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-transparent hover:border-gray-200 transition-all">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Total Hotels</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">{stats.totalHotels}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/hotels')} 
                className="mt-6 text-left text-sm font-semibold text-[#00E08F] hover:text-[#00c981] transition-colors flex items-center gap-1"
              >
                Manage Hotels <span>→</span>
              </button>
            </div>

            {/* Stat Card: Total Bookings */}
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-transparent hover:border-gray-200 transition-all">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Total Bookings</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">{stats.totalBookings}</span>
                </div>
              </div>
              <div className="mt-6">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                  All time
                </span>
              </div>
            </div>

            {/* Stat Card: Pending Bookings */}
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-transparent hover:border-gray-200 transition-all">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Pending Bookings</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">{stats.pendingBookings}</span>
                </div>
              </div>
              <div className="mt-6">
                <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full">
                  Action required
                </span>
              </div>
            </div>

            {/* Stat Card: Confirmed Bookings */}
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-transparent hover:border-gray-200 transition-all">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Confirmed Bookings</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">{stats.confirmedBookings}</span>
                </div>
              </div>
              <div className="mt-6">
                <span className="inline-block px-3 py-1 bg-green-50 text-[#00E08F] text-xs font-semibold rounded-full">
                  Active
                </span>
              </div>
            </div>

          </div>

          {/* Guest Bookings Table */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Guest Bookings</h2>
                <p className="text-sm text-gray-400 mt-1">Manage all bookings across your hotels</p>
              </div>
              
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-4 px-2 font-medium">Booking ID</th>
                    <th className="pb-4 px-2 font-medium">Guest Name</th>
                    <th className="pb-4 px-2 font-medium">Email</th>
                    <th className="pb-4 px-2 font-medium">Room Type</th>
                    <th className="pb-4 px-2 font-medium">Check In</th>
                    <th className="pb-4 px-2 font-medium">Check Out</th>
                    <th className="pb-4 px-2 font-medium">Status</th>
                    <th className="pb-4 px-2 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking._id} className="text-sm border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-2 font-medium text-gray-500">
                          #{booking._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-2 flex items-center gap-3">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${booking.user_id?.name || 'Guest'}&background=random&color=fff`} 
                            alt="avatar" 
                            className="w-8 h-8 rounded-full shadow-sm" 
                          />
                          <span className="font-semibold text-gray-900">{booking.user_id?.name || 'N/A'}</span>
                        </td>
                        <td className="py-4 px-2 text-gray-500">
                          {booking.user_id?.email || 'N/A'}
                        </td>
                        <td className="py-4 px-2 text-gray-600 font-medium">
                          {booking.room_id?.type || 'N/A'}
                        </td>
                        <td className="py-4 px-2 text-gray-600">
                          {new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-2 text-gray-600">
                          {new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold ${getStatusColor(booking.status)}`}>
                            {booking.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleChat(booking._id)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-[#0B0F19] hover:text-white transition-all shadow-sm"
                              title="Open chat"
                            >
                              💬
                            </button>
                            {booking.status === 'Pending' ? (
                              <button
                                type="button"
                                onClick={() => handleApprove(booking._id)}
                                disabled={actionLoadingId === booking._id}
                                className="px-3 py-2 rounded-xl bg-[#00E08F] text-[#0B0F19] font-semibold text-xs shadow-sm hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                title="Approve booking"
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
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          
          
          
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;