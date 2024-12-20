import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import { FaHeart, FaSearch, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';

const Header = ({ onSearch, cartCount }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://209.38.245.158:8001/api/v1/courses/get-category-list/'
        );
        const categoriesArray = Object.entries(response.data).map(([key, value]) => ({
          key,
          value,
        }));
        setCategories(categoriesArray);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
    logout();
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        category: selectedCategory,
        title: searchText,
      });
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          MyCourse.io
        </h1>
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <FaShoppingCart className="text-2xl text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-teal-500 text-white rounded-full text-sm px-2 py-0.5">
              {cartCount}
            </span>
          )}
        </div>
        <div className="relative cursor-pointer" onClick={() => navigate('/wishlist')}>
          <FaHeart className="text-2xl text-gray-700" />
        </div>
        <div className="relative mx-4 flex items-center w-full max-w-xl">
          <input
            type="text"
            placeholder="Search for course"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <select
            className="border rounded-r-md px-3 py-2 text-gray-500 focus:outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.key} value={category.key}>
                {category.value}
              </option>
            ))}
          </select>
          <button onClick={handleSearch}>
            <FaSearch className="search-button" />
          </button>
        </div>
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <div className="relative">
              <img
                src={user?.id_card_image || '/default-avatar.png'}
                alt="Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded w-48">
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate('/my-purchases')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Purchases
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
