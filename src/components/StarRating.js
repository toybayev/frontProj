import React from 'react';

const StarRating = ({ rating, countRatings }) => {
  // Генерируем массив звёзд
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    if (rating >= starValue) {
      return 'full';
    } else if (rating >= starValue - 0.5) {
      return 'half';
    } else {
      return 'empty';
    }
  });

  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        {stars.map((type, index) => (
          <span key={index}>
            {type === 'full' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-yellow-500"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.349 4.153a1 1 0 00.95.69h4.356c.969 0 1.371 1.24.588 1.81l-3.523 2.557a1 1 0 00-.364 1.118l1.349 4.153c.3.921-.755 1.688-1.54 1.118l-3.523-2.557a1 1 0 00-1.176 0l-3.523 2.557c-.785.57-1.838-.197-1.54-1.118l1.349-4.153a1 1 0 00-.364-1.118L2.146 9.58c-.783-.57-.38-1.81.588-1.81h4.356a1 1 0 00.95-.69l1.349-4.153z" />
              </svg>
            )}
            {type === 'half' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-yellow-500"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.349 4.153a1 1 0 00.95.69h4.356c.969 0 1.371 1.24.588 1.81l-3.523 2.557a1 1 0 00-.364 1.118l1.349 4.153c.3.921-.755 1.688-1.54 1.118l-3.523-2.557a1 1 0 00-1.176 0l-3.523 2.557c-.785.57-1.838-.197-1.54-1.118l1.349-4.153a1 1 0 00-.364-1.118L2.146 9.58c-.783-.57-.38-1.81.588-1.81h4.356a1 1 0 00.95-.69l1.349-4.153z" />
              </svg>
            )}
            {type === 'empty' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-gray-300"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.349 4.153a1 1 0 00.95.69h4.356c.969 0 1.371 1.24.588 1.81l-3.523 2.557a1 1 0 00-.364 1.118l1.349 4.153c.3.921-.755 1.688-1.54 1.118l-3.523-2.557a1 1 0 00-1.176 0l-3.523 2.557c-.785.57-1.838-.197-1.54-1.118l1.349-4.153a1 1 0 00-.364-1.118L2.146 9.58c-.783-.57-.38-1.81.588-1.81h4.356a1 1 0 00.95-.69l1.349-4.153z" />
              </svg>
            )}
          </span>
        ))}
      </div>
      <span className="text-gray-600 text-sm">
        {rating} ({countRatings})
      </span>
    </div>
  );
};

export default StarRating;
