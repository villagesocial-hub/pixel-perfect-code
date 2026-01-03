import { cn } from "@/lib/utils";
import { Flame, TrendingUp } from "lucide-react";

interface ProductBadgeProps {
  type: "bestseller" | "trending";
  className?: string;
}

export const ProductBadge = ({ type, className }: ProductBadgeProps) => {
  if (type === "bestseller") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 bg-bestseller text-primary-foreground text-[11px] font-medium rounded",
          className
        )}
      >
        <Flame className="w-3 h-3" />
        Best Seller
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 bg-trending text-primary-foreground text-[11px] font-medium rounded",
        className
      )}
    >
      <TrendingUp className="w-3 h-3" />
      Trending
    </span>
  );
};
