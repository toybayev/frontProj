import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'adobe photoshop',
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const response = await axios.post('http://209.38.245.158:8001/api/v1/courses/add-course/', data, {
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        console.log('Course added successfully!');
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to add course:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-4 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Course</h1>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="adobe photoshop">Adobe Photoshop</option>
          <option value="adobe illustrator">Adobe Illustrator</option>
          <option value="ui/ux design">UI/UX Design</option>
          <option value="web development">Web Development</option>
          <option value="mobile development">Mobile Development</option>
          <option value="data science">Data Science</option>
          <option value="game development">Game Development</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Image</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Add Course
      </button>
    </form>
  );
};

export default AddCourse;
