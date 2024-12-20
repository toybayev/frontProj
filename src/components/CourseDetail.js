import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchCourseDetail } from '../api/courses';
import AddChapter from './AddChapter';
import { addToCart, addToWishlist } from '../api/courses';
import SuccessPopup from './SuccessPopup';

const CourseDetail = ({ cartCount, setCartCount }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedCourse, loading, error } = useSelector((state) => state.courses);

  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [wishlistSuccess, setWishlistSuccess] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(1);

  const handleBuy = async () => {
    setLoadingBuy(true);
    try {
      await addToCart(id);
      setCartCount((prev) => prev + 1);
      setCartSuccess(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoadingBuy(false);
    }
  };

  const handleWishlist = async () => {
    setLoadingWishlist(true);
    try {
      await addToWishlist(id);
      setWishlistSuccess(true);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const token = localStorage.getItem('accessToken');
  const refreshCourseData = () => {
    dispatch(fetchCourseDetail(id));
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await axios.get('http://209.38.245.158:8001/api/v1/auth/get-profile-info', {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        setIsAdmin(response.data.is_superuser);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    loadUserProfile();
  }, [token]);

  useEffect(() => {
    const loadCourseDetail = async () => {
      dispatch({ type: 'FETCH_COURSES_REQUEST' });

      try {
        const data = await fetchCourseDetail(id);
        dispatch({ type: 'FETCH_COURSE_DETAIL_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_COURSE_DETAIL_FAILURE', payload: err.message });
      }
    };

    loadCourseDetail();
  }, [id, dispatch]);

  const handleAddChapter = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'http://209.38.245.158:8001/api/v1/courses/add-course-chapter/',
        {
          course: id,
          title: chapterTitle,
          description: chapterDescription,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setChapterTitle('');
        setChapterDescription('');
        dispatch(fetchCourseDetail(id));
      }
    } catch (err) {
      console.error('Failed to add chapter:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'http://209.38.245.158:8001/api/v1/courses/add-review-and-rating/',
        {
          course: id,
          text: reviewText,
          rating: reviewRating,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert('Review submitted successfully!');
        setReviewText('');
        setReviewRating(1);
        dispatch(fetchCourseDetail(id));
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading course details...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  if (!selectedCourse) return null;

  const goBack = () => navigate(-1);

  const {
    title,
    description,
    image,
    author,
    average_rating,
    count_ratings,
    price,
    reviews,
    chapters,
  } = selectedCourse;

  const handleEdit = () => {
    if (isAdmin) {
      navigate(`/edit-course/${id}`);
    } else {
      alert('Only admins can edit courses.');
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('Only admins can delete courses.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://209.38.245.158:8001/api/v1/courses/delete-course/${id}`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      alert('Course deleted successfully.');
      navigate('/courses');
    } catch (err) {
      console.error('Failed to delete course:', err);
      alert('Error deleting course.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={goBack} className="text-blue-500 underline mb-4">&larr; Back</button>

      <div className="flex justify-between items-center mb-6">
        {cartSuccess && <SuccessPopup message="Course added to your Cart!" onClose={() => setCartSuccess(false)} />}
        {wishlistSuccess && <SuccessPopup message="Course added to your Wishlist!" onClose={() => setWishlistSuccess(false)} />}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <img src={image} alt={title} className="rounded-lg shadow-md w-full mb-4" />
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-gray-600 mb-4">by {author}</p>
          <p className="text-lg text-gray-700 mb-4">{description}</p>
          <p className="text-sm text-gray-600">Rating: {average_rating} ({count_ratings} ratings)</p>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chapters</h2>
              {isAdmin && <button className="bg-blue-500 text-white px-3 py-1 rounded">+ Add Chapter</button>}
            </div>

            {chapters?.map((chapter) => (
              <div key={chapter.id} className="mb-4">
                <h3 className="font-semibold text                lg">{chapter.title}</h3>
                <p className="text-sm text-gray-600">{chapter.description}</p>
              </div>
            ))}

            {chapters?.length === 0 && (
              <p className="text-gray-600">No chapters available for this course.</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mt-6">
            <p className="text-xl font-bold mb-2">Price: ${price}</p>
            <button
              onClick={handleBuy}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
              disabled={loadingBuy}
            >
              {loadingBuy ? 'Adding to Cart...' : 'Buy Course'}
            </button>
            <button
              onClick={handleWishlist}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full"
              disabled={loadingWishlist}
            >
              {loadingWishlist ? 'Adding to Wishlist...' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold mb-4">Add Chapter</h2>
          <form onSubmit={handleAddChapter}>
            <input
              type="text"
              placeholder="Chapter Title"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
              required
            />
            <textarea
              placeholder="Chapter Description"
              value={chapterDescription}
              onChange={(e) => setChapterDescription(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Chapter'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        {reviews?.map((review) => (
          <div key={review.id} className="mb-4 border-b pb-4">
            <p className="font-semibold">{review.text}</p>
            <p className="text-sm text-gray-600">
              Rating: {review.rating} / 5
            </p>
          </div>
        ))}

        <form onSubmit={handleSubmitReview}>
          <textarea
            placeholder="Write a review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded"
            required
          ></textarea>
          <div className="flex items-center mb-2">
            <label className="mr-2">Rating:</label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {isAdmin && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleEdit}
            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
          >
            Edit Course
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;

