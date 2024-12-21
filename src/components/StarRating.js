import React, { useState } from "react";
import "../components/starRating.css";

const StarRating = ({ rating, onRatingChange, disabled }) => {
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
                        onClick={() => !disabled && onRatingChange(starValue)} // Передаём числовое значение, если не disabled
                        onMouseEnter={() => !disabled && setHover(starValue)} // Устанавливаем hover только если не disabled
                        onMouseLeave={() => !disabled && setHover(0)} // Сбрасываем hover только если не disabled
                        disabled={disabled} // Атрибут disabled для кнопки
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
