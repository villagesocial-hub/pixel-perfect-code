import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, SearchX, ShoppingBag, Package, Box, Tag, CreditCard, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingIcons = [
  { Icon: ShoppingBag, className: "top-[15%] left-[8%] w-8 h-8 rotate-[-15deg]" },
  { Icon: Package, className: "top-[25%] right-[10%] w-10 h-10 rotate-[20deg]" },
  { Icon: Box, className: "bottom-[30%] left-[12%] w-7 h-7 rotate-[10deg]" },
  { Icon: Tag, className: "top-[40%] left-[5%] w-6 h-6 rotate-[-25deg]" },
  { Icon: CreditCard, className: "bottom-[20%] right-[8%] w-9 h-9 rotate-[15deg]" },
  { Icon: Truck, className: "top-[20%] left-[15%] w-8 h-8 rotate-[-5deg] hidden sm:block" },
  { Icon: ShoppingBag, className: "bottom-[40%] right-[12%] w-6 h-6 rotate-[-20deg]" },
  { Icon: Package, className: "bottom-[15%] left-[6%] w-10 h-10 rotate-[25deg]" },
  { Icon: Box, className: "top-[35%] right-[6%] w-7 h-7 rotate-[-10deg]" },
  { Icon: Tag, className: "bottom-[25%] right-[15%] w-8 h-8 rotate-[30deg] hidden sm:block" },
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
