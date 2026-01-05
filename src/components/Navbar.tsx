import { ShoppingCart, Search, Heart, Package, User, AlertTriangle, Wrench, TimerOff, Info, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import logo from "@/assets/logo.svg";

export const Navbar = () => {
  const { getCartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--gray-900))] border-b border-gray-800">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Kwixi" className="h-8" />
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 w-full bg-[hsl(var(--gray-800))] border-0 text-white placeholder:text-gray-400 rounded-full"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10 hover:text-white"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* About - hidden on mobile */}
          <Link to="/about" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Info className="w-5 h-5" />
            </Button>
          </Link>

          {/* Privacy Policy - hidden on mobile */}
          <Link to="/privacy-policy" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Shield className="w-5 h-5" />
            </Button>
          </Link>

          {/* Terms of Use - hidden on mobile */}
          <Link to="/terms-of-use" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <FileText className="w-5 h-5" />
            </Button>
          </Link>

          {/* 404 Preview (temporary) - hidden on mobile */}
          <Link to="/404-preview" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <AlertTriangle className="w-5 h-5" />
            </Button>
          </Link>

          {/* Maintenance Preview (temporary) - hidden on mobile */}
          <Link to="/maintenance-preview" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Wrench className="w-5 h-5" />
            </Button>
          </Link>

          {/* Session Expired Preview (temporary) - hidden on mobile */}
          <Link to="/session-expired-preview" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <TimerOff className="w-5 h-5" />
            </Button>
          </Link>

          {/* Orders */}
          <Link to="/orders">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Package className="w-5 h-5" />
            </Button>
          </Link>

          {/* Profile */}
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <User className="w-5 h-5" />
            </Button>
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[hsl(var(--gray-900))] text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 w-full bg-[hsl(var(--gray-800))] border-0 text-white placeholder:text-gray-400 rounded-full"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};
