import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, SearchX, ShoppingBag, Package, Box, Tag, CreditCard, Truck, Heart, Star, Percent, Gift, Wallet, Store, ShoppingCart, Receipt, Bookmark, BadgePercent, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingIcons = [
  { Icon: ShoppingBag, className: "top-[10%] left-[8%] w-8 h-8 rotate-[-15deg]" },
  { Icon: Package, className: "top-[18%] right-[10%] w-10 h-10 rotate-[20deg]" },
  { Icon: Box, className: "bottom-[30%] left-[12%] w-7 h-7 rotate-[10deg]" },
  { Icon: Tag, className: "top-[40%] left-[5%] w-6 h-6 rotate-[-25deg]" },
  { Icon: CreditCard, className: "bottom-[18%] right-[8%] w-9 h-9 rotate-[15deg]" },
  { Icon: Truck, className: "top-[55%] left-[7%] w-8 h-8 rotate-[-5deg]" },
  { Icon: ShoppingBag, className: "bottom-[40%] right-[12%] w-6 h-6 rotate-[-20deg]" },
  { Icon: Package, className: "bottom-[12%] left-[6%] w-10 h-10 rotate-[25deg]" },
  { Icon: Box, className: "top-[30%] right-[6%] w-7 h-7 rotate-[-10deg]" },
  { Icon: Tag, className: "bottom-[25%] right-[15%] w-8 h-8 rotate-[30deg]" },
  { Icon: Heart, className: "top-[12%] left-[18%] w-6 h-6 rotate-[12deg]" },
  { Icon: Star, className: "top-[22%] right-[18%] w-7 h-7 rotate-[-18deg]" },
  { Icon: Percent, className: "bottom-[45%] left-[4%] w-8 h-8 rotate-[8deg]" },
  { Icon: Gift, className: "top-[48%] right-[5%] w-9 h-9 rotate-[-12deg]" },
  { Icon: Wallet, className: "bottom-[35%] right-[6%] w-6 h-6 rotate-[22deg]" },
  { Icon: Store, className: "top-[8%] right-[15%] w-8 h-8 rotate-[5deg]" },
  { Icon: ShoppingCart, className: "bottom-[8%] right-[18%] w-10 h-10 rotate-[-8deg]" },
  { Icon: Receipt, className: "top-[60%] left-[10%] w-7 h-7 rotate-[18deg]" },
  { Icon: Bookmark, className: "bottom-[55%] right-[10%] w-6 h-6 rotate-[-15deg]" },
  { Icon: BadgePercent, className: "top-[35%] left-[15%] w-9 h-9 rotate-[-22deg]" },
  { Icon: PackageOpen, className: "bottom-[22%] left-[16%] w-8 h-8 rotate-[15deg]" },
  { Icon: Heart, className: "top-[65%] right-[14%] w-7 h-7 rotate-[28deg]" },
  { Icon: CreditCard, className: "top-[5%] left-[25%] w-6 h-6 rotate-[-8deg] hidden sm:block" },
  { Icon: Truck, className: "bottom-[5%] right-[25%] w-7 h-7 rotate-[12deg] hidden sm:block" },
  { Icon: Gift, className: "top-[75%] left-[5%] w-8 h-8 rotate-[-20deg]" },
  { Icon: Star, className: "bottom-[65%] left-[8%] w-5 h-5 rotate-[35deg]" },
  { Icon: ShoppingCart, className: "top-[28%] left-[3%] w-7 h-7 rotate-[18deg]" },
  { Icon: Store, className: "bottom-[48%] right-[4%] w-8 h-8 rotate-[-25deg]" },
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
          <h1 className="text-[150px] font-bold text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <SearchX className="w-20 h-20 text-primary" />
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
