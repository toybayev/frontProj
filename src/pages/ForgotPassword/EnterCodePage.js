import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkResetPasswordCode } from '../../api/auth';

const EnterCodePage = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const email = useSelector((state) => state.auth.email);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      return setError('Code is required');
    }

    try {
        
      console.log(email);
      await checkResetPasswordCode({ email, code });
      navigate('/forgot-password/reset-password');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid reset code');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Enter Reset Code</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Reset Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code sent to your email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600">
            Verify Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterCodePage;
