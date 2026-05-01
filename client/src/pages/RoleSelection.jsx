import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

const RoleSelection = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async (role) => {
    try {
      setLoading(true);
      setError('');

      const response = await authService.selectRole({ role });
      login(response.data.user, response.data.token);

      // Redirect based on role
      if (role === 'Owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Role selection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="relative">
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Prime Booking</h1>
            <h2 className="mb-4 text-xl font-semibold text-gray-700">Choose Your Role</h2>
            <p className="mx-auto max-w-md text-base leading-relaxed text-gray-600">
              Select how you'd like to use our platform and start your journey
            </p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          <div className="grid md:grid-cols-2 gap-6">
            <div
              className={`group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={() => handleRoleSelection('Guest')}
            >
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 transition-colors group-hover:bg-indigo-200">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">I'm a Guest</h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Book amazing hotels, manage your reservations, and enjoy seamless stays with real-time communication
                </p>
                <ul className="space-y-2 text-left text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Browse and book hotels
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Manage reservations
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Chat with hotel owners
                  </li>
                </ul>
              </div>
            </div>

            <div
              className={`group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={() => handleRoleSelection('Owner')}
            >
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 transition-colors group-hover:bg-indigo-200">
                  <span className="text-3xl">🏨</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">I'm a Hotel Owner</h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Manage your properties, connect with guests, and grow your business with our platform
                </p>
                <ul className="space-y-2 text-left text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Manage hotels & rooms
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Handle bookings
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Communicate with guests
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    View booking analytics
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;