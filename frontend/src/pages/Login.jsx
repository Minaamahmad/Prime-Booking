import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import '../styles/Login.css';
import Mybutton from '../components/button.jsx';


const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Prime Booking</h1>
        <h2>Welcome Back</h2>
        <p>Sign in to book hotels or manage your properties</p>

        <ErrorAlert message={error} onClose={() => setError('')} />
           
        <div className="w-91 h-40  flex items-center justify-center">

          
           <Mybutton   
           
             disabled={loading} onClick={handleGoogleLogin}
          
           
           
           /> 
           </div>
     

       
      </div>
    </div>
  );
};

export default Login;
