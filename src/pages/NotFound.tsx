import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, OctagonX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Stop Sign */}
        <div className="mb-8 flex justify-center">
          <OctagonX className="w-32 h-32 text-destructive animate-spin" style={{ animationDuration: '3s' }} />
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
