import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../api/courses';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

const CourseList = ({ onSearch }) => {
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://209.38.245.158:8001/api/v1/auth/get-profile-info', {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        setIsAdmin(response.data.is_superuser);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setIsAdmin(false);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    if (onSearch) {
      onSearch(loadCourses);
    }
  }, [onSearch]);

  const loadCourses = async (searchParams = {}) => {
    dispatch({ type: 'FETCH_COURSES_REQUEST' });

    try {
      const data = await fetchCourses(searchParams);
      dispatch({ type: 'FETCH_COURSES_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_COURSES_FAILURE', payload: err.message });
    }
  };

  useEffect(() => {
    loadCourses();
  }, [dispatch]);

  useEffect(() => {
    if (onSearch) onSearch(loadCourses);
  }, [onSearch]);

  if (loading) return <p className="text-center mt-8">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Courses</h1>
      {isAdmin && (
        <button
          onClick={() => navigate('/add-course')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Course
        </button>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div 
          onClick={() => navigate(`/course/${course.id}`)} key={course.id} className="cursor-pointer p-4 border rounded-lg shadow-md bg-white">
            <img
              src={course.image}
              alt={course.title}
              className="rounded mb-4 h-40 w-full object-cover"
            />
            <h3 className="font-bold text-lg">{course.title}</h3>
            <p className="text-sm text-gray-500 mb-2">by {course.author}</p>
            <p className="text-sm text-gray-700 mb-4">{course.description}</p>

            <div className="flex items-center justify-between">
              <div>
                <span
                  className="text-teal-500 font-bold text-lg"
                >
                  {course.price} KZT
                </span>{' '}
                <span className="line-through text-gray-400">{course.first_price} KZT</span>
              </div>
              <StarRating rating={course.average_rating} countRatings={course.count_ratings} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
