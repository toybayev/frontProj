import React, { useEffect, useState } from 'react';
import { removeFromCart } from '../api/courses';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = ({ setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalCost, setTotalCost] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0); // Total price of cart items
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://209.38.245.158:8001/api/v1/courses/get-cart/', {
          headers: {
            Authorization: `JWT ${localStorage.getItem('accessToken')}`,
          },
        });

        console.log('Cart API Response:', response.data);
        setCartItems(response.data.courses);
        const priceSum = response.data.courses.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(priceSum);
      } catch (err) {
        console.error('Failed to fetch cart items:', err);
        setError('Failed to fetch cart items.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await axios.get('http://209.38.245.158:8001/api/v1/courses/get-cities/', {
          headers: {
            Authorization: `JWT ${localStorage.getItem('accessToken')}`,
          },
        });
        console.log('Cities API Response:', response.data);
        setCities(response.data);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };

    fetchCartItems();
    fetchCities();
  }, []);

  const fetchTotalCost = async (cityName) => {
    try {
      const response = await axios.get(
        `http://209.38.245.158:8001/api/v1/courses/get-total-cost/${cityName}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      console.log('Total Cost API Response:', response.data);
      setTotalCost(response.data.total_cost); // Assuming `total_cost` is part of the response
    } catch (err) {
      console.error('Failed to fetch total cost:', err);
    }
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    if (cityName) {
      fetchTotalCost(cityName); // Fetch total cost for the selected city
    } else {
      setTotalCost(null); // Reset total cost when no city is selected
    }
  };

  const handleRemove = async (courseId) => {
    try {
      await removeFromCart(courseId);

      // Update local state and cart counter
      setCartItems((prev) => prev.filter((item) => item.id !== courseId));
      setCartCount((prev) => prev - 1);

      const updatedTotalPrice = cartItems
        .filter((item) => item.id !== courseId)
        .reduce((sum, item) => sum + item.price, 0);
      setTotalPrice(updatedTotalPrice);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  };

  const handleCheckout = async () => {
    if (!selectedCity || !address) {
      alert('Please select a city and enter your address.');
      return;
    }

    const checkoutData = {
      city: selectedCity,
      address,
    };

    try {
      const response = await axios.post(
        'http://209.38.245.158:8001/api/v1/courses/checkout/',
        checkoutData,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      console.log('Checkout Response:', response.data);
      alert('Purchase successful!');
      navigate('/'); // Redirect to the home page or a confirmation page
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed. Please try again.');
    }
  };

  const goBack = () => navigate(-1);

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (cartItems.length === 0) return <p className="text-center mt-8">Your cart is empty.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      <button className="back-button" onClick={goBack}>
        &#8592; Back
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-md bg-white">
            <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover mb-4" />
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
            <p className="text-teal-500 font-bold">{item.price} KZT</p>
            <button
              onClick={() => handleRemove(item.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Choose Your City Section */}
      <div className="mt-8 p-6 border rounded-lg bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Choose Your City</h2>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city.key} value={city.key}>
              {city.name} - {city.cost} KZT (Delivery: {city.delivery_time} days)
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mt-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <p className="mt-4 text-lg font-bold">Cart Total: {totalPrice} KZT</p>
        {totalCost !== null && (
          <p className="text-teal-500 text-lg">
            Total Cost with Delivery: <strong>{totalCost} KZT</strong>
          </p>
        )}
        <button
          onClick={handleCheckout}
          className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
