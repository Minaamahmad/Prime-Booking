import { useState } from 'react';
import ErrorAlert from '../components/ErrorAlert';
import Mybutton from '../components/Button.jsx';

const Login = () => {
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-teal/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-amber/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-teal to-primary-amber rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Prime Booking</h1>
            <h2 className="text-xl font-semibold text-slate-300 mb-4">Welcome Back</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sign in to book amazing hotels or manage your properties with ease
            </p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          <div className="space-y-4">
            <div className="text-center">
              <Mybutton
                onClick={handleGoogleLogin}
              />
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-primary-teal hover:text-primary-teal/80 transition">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-teal hover:text-primary-teal/80 transition">
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
