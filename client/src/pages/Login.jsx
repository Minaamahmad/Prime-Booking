import { useState } from 'react';
import ErrorAlert from '../components/ErrorAlert';
import Button from '../components/Button.jsx';

const Login = () => {
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Prime Booking</h1>
            <h2 className="mb-4 text-xl font-semibold text-gray-700">Welcome Back</h2>
            <p className="text-base leading-relaxed text-gray-600">
              Sign in to book amazing hotels or manage your properties with ease
            </p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          <div className="space-y-4">
            <div className="text-center">
              <Button
                onClick={handleGoogleLogin}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-indigo-600 font-medium transition hover:text-indigo-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 font-medium transition hover:text-indigo-700">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
