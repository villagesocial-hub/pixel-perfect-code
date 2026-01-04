import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const EmptyWishlist = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
          <Heart className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-sm font-bold">0</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Save items you love by clicking the heart icon on any product. They'll appear here so you can easily find them later.
      </p>
      <Link to="/">
        <Button variant="cart" size="lg" className="gap-2">
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
        </Button>
      </Link>
    </div>
  );
};
