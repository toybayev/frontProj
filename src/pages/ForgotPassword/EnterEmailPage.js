import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendResetPasswordCode } from '../../api/auth';
import { setEmail } from '../../store/authReducer';

const EnterEmailPage = () => {
  const [email, setEmailState] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError('Email is required');
    }

    try {
      await sendResetPasswordCode(email);
      dispatch(setEmail(email));

      navigate('/forgot-password/enter-code');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Enter Your Email</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmailState(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600">
            Send Reset Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterEmailPage;
