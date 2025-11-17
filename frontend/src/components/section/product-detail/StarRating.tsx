import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

// Interface cho props của StarRating
export interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  interactive = false,
  size = "md",
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={
            (interactive ? hoverRating || rating : rating) >= star
              ? faStarSolid
              : faStarRegular
          }
          className={`text-yellow-400 ${sizeClasses[size]} ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : ""
          }`}
          onClick={() => interactive && setRating && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

export default StarRating;