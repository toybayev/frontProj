import React, { useState } from 'react';
import axios from 'axios';

const AddChapter = ({ courseId, onChapterAdded }) => {
  const [chapterData, setChapterData] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapterData({ ...chapterData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        'http://209.38.245.158:8001/api/v1/courses/add-course-chapter/',
        {
          ...chapterData,
          course: courseId,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setChapterData({ title: '', description: '' });
        if (onChapterAdded) onChapterAdded();
      }
    } catch (err) {
      console.error('Failed to add chapter:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add a Chapter</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
          Chapter Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={chapterData.title}
          onChange={handleChange}
          placeholder="Chapter Title"
          className="w-full border rounded-lg p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block font-semibold mb-2">
          Chapter Description
        </label>
        <textarea
          id="description"
          name="description"
          value={chapterData.description}
          onChange={handleChange}
          placeholder="Chapter Description"
          rows="4"
          className="w-full border rounded-lg p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Chapter'}
      </button>
    </form>
  );
};

export default AddChapter;
