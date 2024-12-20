import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, getUserData } from '../../api/auth';
import SuccessPopup from '../../components/SuccessPopup';
import { useEffect } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        dispatch({ type: 'SET_USER_DATA', payload: data });
      } catch (err) {
        console.error('Error fetching user data', err);
      }
    };
  
    fetchUserData();
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  
    if (!email || !password) {
      return setError('Both email and password are required');
    }
  
    setLoading(true);
    try {
      const response = await login({ email, password });
      setSuccess(true);
  
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
  
      const userData = await getUserData();
  
      dispatch({
        type: 'SET_USER',
        payload: {
          user: userData,
          accessToken: response.access,
          refreshToken: response.refresh,
        },
      });
      setLoading(false);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Invalid email or password');
    }
  };
  

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Перенаправляем на страницу сброса пароля
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
        {success && (
        <SuccessPopup
          message="Logged in successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={handleForgotPassword}
            className="text-teal-500 underline hover:text-teal-600"
          >
            Forgot Password?
          </button>
        </div>
        <p className="text-center mt-4">
          If you are not authorized?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-teal-500 cursor-pointer underline hover:text-teal-600"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;