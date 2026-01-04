import { Heart, Clock, Truck, Store, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { ProductBadge } from "./ProductBadge";
import { StarRating } from "./StarRating";
import { SoldBadge } from "./SoldBadge";
import { useWishlist, WishlistItem } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface WishlistCardProps extends Omit<WishlistItem, "addedAt"> {
  showStartRating?: boolean;
}

export const WishlistCard = ({
  id,
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
  showStartRating = false,
}: WishlistCardProps) => {
  const { removeItem } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const stockPercentage = stockLeft ? Math.min((stockLeft / 10) * 100, 100) : 0;

  const handleRemove = () => {
    removeItem(id);
    toast({
      title: "Removed from wishlist",
      description: title.slice(0, 50) + "...",
    });
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      image,
      title,
      price,
      originalPrice,
      seller,
    });
    toast({
      title: "Added to cart",
      description: title.slice(0, 50) + "...",
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col w-full h-full group">
      {/* Image Container */}
      <div className="relative">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-[5px] left-0 flex gap-1 z-10 px-0">
            {badges.map((badge) => (
              <ProductBadge key={badge} type={badge} />
            ))}
          </div>
        )}

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="absolute top-[5px] right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="bg-destructive/90 hover:bg-destructive rounded-lg px-2 py-1.5 transition-colors flex items-center gap-1">
            <Trash2 className="w-4 h-4 text-destructive-foreground" />
            <span className="text-xs text-destructive-foreground font-medium">Remove</span>
          </div>
        </button>

        {/* Heart Icon - Always filled since it's in wishlist */}
        <div className="absolute top-[5px] right-2 z-10 group-hover:opacity-0 transition-opacity">
          <Heart className="w-5 h-5 fill-urgency text-urgency" />
        </div>

        {/* Product Image */}
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

        {/* Offer Timer */}
        {offerEndsIn && (
          <div className="flex items-center gap-1 text-xs text-primary mb-1.5 bg-primary/10 px-2 py-1 rounded w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-bold">Offer ends in {offerEndsIn}</span>
          </div>
        )}

        {/* Stock Warning */}
        {stockLeft && (
          <div className="mb-1.5">
            <div className="flex items-center justify-start gap-2 text-xs mb-1">
              <span className="text-urgency font-medium">Only {stockLeft} left</span>
              <span className="text-primary font-bold">Hurry!</span>
            </div>
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

        {/* Seller */}
        {seller && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 bg-secondary px-2 py-1.5 rounded w-fit">
            <Store className="w-3.5 h-3.5" />
            <span>{seller}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          <Button variant="cart" size="cart" className="flex-1" onClick={handleAddToCart}>
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9"
            onClick={handleRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
