import { ShoppingCart, Heart, Package, User, Info, FileText, Shield, Truck, Menu, X, SearchX, Clock, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "./ui/button";
import { useState } from "react";
import logo from "@/assets/logo.svg";

export const Navbar = () => {
  const { getCartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = getCartCount();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--gray-900))] border-b border-gray-800">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Kwixi" className="h-8" />
        </Link>

        {/* Desktop/Tablet Navigation */}
        <div className="hidden sm:flex items-center gap-1">
          {/* Info Pages */}
          <Link to="/about">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Info className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/delivery">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Truck className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/privacy-policy">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Shield className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/terms-of-use">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <FileText className="w-5 h-5" />
            </Button>
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-700 mx-1" />

          {/* Preview Pages */}
          <Link to="/404-preview">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <SearchX className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/maintenance-preview">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Wrench className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/session-expired-preview">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <Clock className="w-5 h-5" />
            </Button>
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-700 mx-1" />

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

        {/* Mobile Burger Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden text-white hover:bg-white/10 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-[hsl(var(--gray-900))] border-t border-gray-800 px-4 py-3 animate-fade-in">
          <nav className="flex flex-col gap-1">
            <Link
              to="/orders"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="text-sm">My Orders</span>
            </Link>
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-sm">My Profile</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="text-sm">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-auto text-xs bg-white text-[hsl(var(--gray-900))] px-2 py-0.5 rounded-full font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="h-px bg-gray-800 my-2" />

            <Link
              to="/about"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Info className="w-5 h-5" />
              <span className="text-sm">About Us</span>
            </Link>
            <Link
              to="/delivery"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Truck className="w-5 h-5" />
              <span className="text-sm">Shipping & Delivery</span>
            </Link>
            <Link
              to="/privacy-policy"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm">Privacy Policy</span>
            </Link>
            <Link
              to="/terms-of-use"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm">Terms of Use</span>
            </Link>

            {/* Divider */}
            <div className="h-px bg-gray-800 my-2" />

            <Link
              to="/404-preview"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <SearchX className="w-5 h-5" />
              <span className="text-sm">404 Page</span>
            </Link>
            <Link
              to="/maintenance-preview"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Wrench className="w-5 h-5" />
              <span className="text-sm">Maintenance Page</span>
            </Link>
            <Link
              to="/session-expired-preview"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Clock className="w-5 h-5" />
              <span className="text-sm">Session Expired</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
