import React, { useState } from "react";
import "../components/starRating.css";

const StarRating = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="star-rating">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1; // Значение звезды
                return (
                    <button
                        type="button"
                        key={starValue}
                        className={`star ${starValue <= (hover || rating) ? "filled" : ""}`}
                        onClick={() => onRatingChange(starValue)} // Передаём числовое значение
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
