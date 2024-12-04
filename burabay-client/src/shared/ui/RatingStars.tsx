import { FC } from "react";
import { StarIcon } from "./RatingStarIcon";
import { COLORS } from "./colors";
import { Typography } from "./Typography";

interface RatingStarsProps {
  rating: number; // Рейтинг компании (от 0 до 5)
  maxRating?: number; // Максимальное количество звезд (по умолчанию 5)
}

export const RatingStars: FC<RatingStarsProps> = ({ rating, maxRating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  const partialStarWidth = Math.round((rating % 1) * 100)
  return (
    <div className="flex items-center">
      {/* Полные звезды */}
      {[...Array(fullStars)].map((_, index) => (
        <StarIcon key={`full-${index}`} fill={COLORS.main200} /> // Задаем оранжевый цвет для полной звезды
      ))}

      {/* Половина звезды */}
      {hasHalfStar && <StarIcon fill="url(#halfGradient)" />}
      {/* Пустые звезды */}
      {[...Array(emptyStars)].map((_, index) => (
        <StarIcon key={`empty-${index}`} fill={COLORS.alternative} />
      ))}


      {/* Числовое значение рейтинга */}
      <Typography>{rating.toFixed(1)}</Typography>

      {/* Градиент для половинки звезды */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="halfGradient">
            <stop offset={`${partialStarWidth}%`} stopColor={COLORS.main200} />
            <stop offset={`${partialStarWidth}%`} stopColor={COLORS.alternative} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
