import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../api/auth';
import { setEmail } from '../../store/authReducer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    iin: '',
    id_card_image: null, // Для файла
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Если поле — файл, сохраняем файл
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, first_name, last_name, phone, iin, id_card_image } =
      formData;

    // Валидация
    if (!email || !password || !confirmPassword || !first_name || !last_name || !phone || !iin) {
      return setError('All fields are required');
    }
    if (!validateEmail(email)) {
      return setError('Invalid email address');
    }
    if (!validatePassword(password)) {
      return setError(
        'Password must be 8-20 characters, include uppercase, lowercase, number, and special character'
      );
    }
    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }
    if (!id_card_image) {
      return setError('ID Card Image is required');
    }

    try {
      await signUp({ email, password, first_name, last_name, phone, iin, id_card_image });
      setSuccess(true);
      dispatch(setEmail(email));
      setTimeout(() => {
        navigate('/verify');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'User already exists');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        {success ? (
          <div>Success Animation</div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
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
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">IIN</label>
                <input
                  type="text"
                  name="iin"
                  value={formData.iin}
                  onChange={handleChange}
                  placeholder="Enter your IIN"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700">ID Card Image</label>
                <input
                  type="file"
                  name="id_card_image"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <button className="w-full bg-teal-500 text-white py-2 rounded">
                Sign Up
              </button>
            </form>
            <p className="text-center mt-4">
              If you have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-teal-500 cursor-pointer"
              >
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
