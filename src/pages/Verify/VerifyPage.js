import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyCode } from '../../api/auth';
import { setUser } from '../../store/authReducer';
import SuccessPopup from '../../components/SuccessPopup';

const VerifyPage = () => {
  const email = useSelector((state) => state.auth.email); // Получаем email
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await verifyCode({ email, code });
      dispatch({ type: 'SET_USER', payload: userData });
      setSuccess(true); // Показываем всплывающее окно
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
        {success && (
        <SuccessPopup
            message="Code verified successfully!"
            onClose={() => setSuccess(false)}
        />
        )}
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Verify Code</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <button className="w-full bg-teal-500 text-white py-2 rounded">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
