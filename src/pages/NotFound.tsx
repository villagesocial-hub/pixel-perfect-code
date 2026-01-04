import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, SearchX, ShoppingBag, Package, Box, Tag, CreditCard, Truck, Heart, Star, Percent, Gift, Wallet, Store, ShoppingCart, Receipt, Bookmark, BadgePercent, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingIcons = [
  // Left side - spread vertically
  { Icon: ShoppingBag, className: "top-[5%] left-[6%] w-8 h-8 rotate-[-15deg]" },
  { Icon: Percent, className: "top-[18%] left-[12%] w-7 h-7 rotate-[8deg]" },
  { Icon: Tag, className: "top-[32%] left-[4%] w-6 h-6 rotate-[-25deg]" },
  { Icon: BadgePercent, className: "top-[45%] left-[14%] w-9 h-9 rotate-[-22deg]" },
  { Icon: Truck, className: "top-[58%] left-[5%] w-8 h-8 rotate-[-5deg]" },
  { Icon: Receipt, className: "top-[70%] left-[11%] w-7 h-7 rotate-[18deg]" },
  { Icon: Gift, className: "top-[82%] left-[4%] w-8 h-8 rotate-[-20deg]" },
  
  // Right side - spread vertically
  { Icon: Package, className: "top-[6%] right-[8%] w-10 h-10 rotate-[20deg]" },
  { Icon: Star, className: "top-[19%] right-[14%] w-7 h-7 rotate-[-18deg]" },
  { Icon: Box, className: "top-[33%] right-[5%] w-7 h-7 rotate-[-10deg]" },
  { Icon: Gift, className: "top-[46%] right-[12%] w-9 h-9 rotate-[-12deg]" },
  { Icon: Bookmark, className: "top-[59%] right-[6%] w-6 h-6 rotate-[-15deg]" },
  { Icon: Heart, className: "top-[71%] right-[13%] w-7 h-7 rotate-[28deg]" },
  { Icon: ShoppingCart, className: "top-[83%] right-[7%] w-10 h-10 rotate-[-8deg]" },
  
  // Extra scattered - hidden on mobile
  { Icon: Store, className: "top-[10%] right-[22%] w-8 h-8 rotate-[5deg] hidden md:block" },
  { Icon: Heart, className: "top-[25%] left-[20%] w-6 h-6 rotate-[12deg] hidden md:block" },
  { Icon: CreditCard, className: "top-[40%] right-[20%] w-6 h-6 rotate-[-8deg] hidden md:block" },
  { Icon: PackageOpen, className: "top-[55%] left-[18%] w-8 h-8 rotate-[15deg] hidden md:block" },
  { Icon: Wallet, className: "top-[68%] right-[20%] w-6 h-6 rotate-[22deg] hidden md:block" },
  { Icon: ShoppingBag, className: "top-[80%] left-[18%] w-6 h-6 rotate-[-20deg] hidden md:block" },
  { Icon: Truck, className: "top-[12%] left-[26%] w-7 h-7 rotate-[12deg] hidden lg:block" },
  { Icon: Store, className: "top-[75%] right-[24%] w-8 h-8 rotate-[-25deg] hidden lg:block" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <item.Icon
          key={index}
          className={`absolute text-muted-foreground/10 ${item.className}`}
        />
      ))}

      <div className="max-w-md w-full text-center relative z-10">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] font-bold text-muted-foreground/20 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <SearchX className="w-20 h-20 text-foreground" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Page not found
        </h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" />
              Go back
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Back to home
            </Link>
          </Button>
        </div>

        {/* Path info */}
        <p className="mt-8 text-xs text-muted-foreground">
          Requested path: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
