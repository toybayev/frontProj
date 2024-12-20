import axios from 'axios';

const API_BASE_URL = 'http://209.38.245.158:8001/api/v1/courses';

export const fetchCourseDetail = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/get-course-detail/${id}/`);
  return response.data;
};

export const fetchCourses = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/get-course-list/`, { params });
  return response.data;
};

export const addToCart = async (courseId) => {
  const response = await axios.post(
    `${API_BASE_URL}/add-to-cart/`,
    { course_id: courseId },
    {
      headers: {
        Authorization: `JWT ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return response.data;
};

export const addToWishlist = async (courseId) => {
  const response = await axios.post(
    `${API_BASE_URL}/add-to-favorite/`,
    { course_id: courseId },
    {
      headers: {
        Authorization: `JWT ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return response.data;
};

export const removeFromCart = async (courseId) => {
  const response = await axios.post(
    'http://209.38.245.158:8001/api/v1/courses/remove-from-cart/',
    { course_id: courseId },
    {
      headers: {
        Authorization: `JWT ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return response.data;
};

export const fetchWishlist = async () => {
  const response = await axios.get(
    'http://209.38.245.158:8001/api/v1/courses/get-favorite/',
    {
      headers: {
        Authorization: `JWT ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return response.data;
};

export const removeFromWishlist = async (courseId) => {
  const response = await axios.post(
    'http://209.38.245.158:8001/api/v1/courses/remove-from-favorite/',
    { course_id: courseId },
    {
      headers: {
        Authorization: `JWT ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return response.data;
};