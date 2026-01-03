import { Heart, Clock, Truck, Store } from "lucide-react";
import { Button } from "./ui/button";
import { ProductBadge } from "./ProductBadge";
import { StarRating } from "./StarRating";
import { SoldBadge } from "./SoldBadge";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  image: string;
  title: string;
  rating: number;
  reviewCount: number;
  soldCount?: string;
  price: number;
  originalPrice?: number;
  savePercent?: number;
  offerEndsIn?: string;
  stockLeft?: number;
  freeDeliveryMin?: number;
  deliveryDate?: string;
  seller?: string;
  badges?: ("bestseller" | "trending")[];
  colorVariants?: string[];
  isFavorite?: boolean;
  showStartRating?: boolean;
}

export const ProductCard = ({
  image,
  title,
  rating,
  reviewCount,
  soldCount,
  price,
  originalPrice,
  savePercent,
  offerEndsIn,
  stockLeft,
  freeDeliveryMin,
  deliveryDate,
  seller,
  badges = [],
  colorVariants,
  isFavorite = false,
  showStartRating = false,
}: ProductCardProps) => {
  const [favorite, setFavorite] = useState(isFavorite);

  // Calculate stock percentage for progress bar (assume max stock is 10)
  const stockPercentage = stockLeft ? Math.min((stockLeft / 10) * 100, 100) : 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col w-full h-full">
      {/* Image Container */}
      <div className="relative">
        {/* Badges - 5px from top of card, positioned over image */}
        {badges.length > 0 && (
          <div className="absolute top-[5px] left-0 flex gap-1 z-10 px-0">
            {badges.map((badge) => (
              <ProductBadge key={badge} type={badge} />
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setFavorite(!favorite)}
          className="absolute top-[5px] right-2 z-10"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              favorite ? "fill-urgency text-urgency" : "text-muted-foreground"
            )}
          />
        </button>

        {/* Product Image - Full width, square, touches left/right edges */}
        <div className="aspect-square w-full bg-secondary/30">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain p-4"
          />
        </div>

        {/* Color Variants */}
        {colorVariants && colorVariants.length > 0 && (
          <div className="absolute bottom-3 right-3 flex flex-col gap-1">
            {colorVariants.slice(0, 3).map((color, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
            {colorVariants.length > 3 && (
              <span className="text-[10px] text-muted-foreground text-center">
                +{colorVariants.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-sm font-normal text-foreground line-clamp-2 mb-1.5 leading-tight">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating
            rating={rating}
            reviewCount={reviewCount}
            showStartRating={showStartRating}
          />
          {soldCount && <SoldBadge count={soldCount} />}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="text-2xl font-bold text-price">
            <span className="text-base align-top">$</span>
            {Math.floor(price)}
            <span className="text-sm">.{((price % 1) * 100).toFixed(0).padStart(2, "0")}</span>
          </span>
          {originalPrice && (
            <span className="text-sm text-price-original line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {savePercent && (
            <span className="text-xs font-medium text-save bg-save/10 px-1.5 py-0.5 rounded">
              Save {savePercent}%
            </span>
          )}
        </div>

        {/* Offer Timer - with background */}
        {offerEndsIn && (
          <div className="flex items-center gap-1 text-xs text-primary mb-1.5 bg-primary/10 px-2 py-1 rounded w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-bold">Offer ends in {offerEndsIn}</span>
          </div>
        )}

        {/* Stock Warning - Right aligned with progress bar */}
        {stockLeft && (
          <div className="mb-1.5">
            <div className="flex items-center justify-start gap-2 text-xs mb-1">
              <span className="text-urgency font-medium">Only {stockLeft} left</span>
              <span className="text-primary font-bold">Hurry!</span>
            </div>
            {/* Stock Progress Bar */}
            <div className="h-1.5 bg-border rounded-full overflow-hidden w-full">
              <div
                className="h-full bg-urgency rounded-full transition-all duration-300"
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Delivery Info */}
        {freeDeliveryMin && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Free delivery ${freeDeliveryMin}+</span>
            {deliveryDate && (
              <>
                <Clock className="w-3.5 h-3.5 ml-1" />
                <span>{deliveryDate}</span>
              </>
            )}
          </div>
        )}

        {/* Seller - with grey background */}
        {seller && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 bg-secondary px-2 py-1.5 rounded w-fit">
            <Store className="w-3.5 h-3.5" />
            <span>{seller}</span>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button variant="cart" size="cart" className="mt-auto w-fit">
          Add to cart
        </Button>
      </div>
    </div>
  );
};
