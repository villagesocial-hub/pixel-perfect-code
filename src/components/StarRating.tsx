import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount: number;
  showStartRating?: boolean;
  className?: string;
}

export const StarRating = ({
  rating,
  reviewCount,
  showStartRating = false,
  className,
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;

          return (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                isFilled
                  ? "fill-star text-star"
                  : isHalf
                  ? "fill-star/50 text-star"
                  : "fill-transparent text-star stroke-[1.5px]"
              )}
            />
          );
        })}
      </div>
      {showStartRating ? (
        <span className="text-muted-foreground">Start the rating</span>
      ) : (
        <>
          <span className="text-foreground font-medium">{rating}</span>
          <span className="text-muted-foreground">({reviewCount})</span>
        </>
      )}
    </div>
  );
};
