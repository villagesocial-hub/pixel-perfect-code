import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
}

export function StarRating({ value }: StarRatingProps) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const full = Math.floor(v);
  const partial = v - full;

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${v} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const isFull = idx <= full;
        const isPartial = idx === full + 1 && partial > 0;

        return (
          <div key={idx} className="relative h-5 w-5">
            <Star
              className={`h-5 w-5 ${isFull ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
            />
            {isPartial && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${Math.round(partial * 100)}%` }}
              >
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
