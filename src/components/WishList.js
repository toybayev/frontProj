import React, { useEffect, useState } from 'react';
import { fetchWishlist, removeFromWishlist } from '../api/courses';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        const data = await fetchWishlist();
        setWishlistItems(data);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setError('Failed to fetch wishlist.');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleRemove = async (courseId) => {
    try {
      await removeFromWishlist(courseId);

      // Обновляем локальное состояние
      setWishlistItems((prev) => prev.filter((item) => item.id !== courseId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (wishlistItems.length === 0) return <p className="text-center mt-8">Your wishlist is empty.</p>;
  const goBack = () => navigate(-1)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h1>
      <button className="back-button" onClick={goBack}>
        &#8592; Назад
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-md bg-white">
            <img src={item.image_url}/>
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
    </div>
  );
};

export default Wishlist;
