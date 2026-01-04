import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const funnyMessages = [
  "Looks like this page went on vacation... without telling anyone. 🏖️",
  "This page is playing hide and seek. Spoiler: it's winning. 🙈",
  "Houston, we have a problem. This page has left the building. 🚀",
  "Plot twist: the page you're looking for doesn't exist. 😱",
  "This page took a wrong turn at Albuquerque. 🗺️",
];

const NotFound = () => {
  const location = useLocation();
  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[120px] sm:text-[150px] font-black text-foreground leading-none select-none animate-fade-in">
              4
            </span>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-foreground flex items-center justify-center bg-background">
                <Search className="w-8 h-8 sm:w-12 sm:h-12 text-foreground animate-pulse" />
              </div>
            </div>
            <span className="text-[120px] sm:text-[150px] font-black text-foreground leading-none select-none animate-fade-in" style={{ animationDelay: '0.2s' }}>
              4
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Oops! Page Not Found
        </h2>

        {/* Funny message */}
        <p className="text-lg text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {randomMessage}
        </p>
        
        <p className="text-sm text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Don't worry, even the best explorers get lost sometimes.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            variant="outline" 
            className="gap-2 group"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go back
          </Button>
          <Button asChild className="gap-2 group">
            <Link to="/">
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Take me home
            </Link>
          </Button>
        </div>

        {/* Easter egg */}
        <p className="mt-10 text-xs text-muted-foreground/60 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          Error code: <code className="bg-muted px-2 py-1 rounded font-mono">{location.pathname}</code>
          <br />
          <span className="mt-2 inline-block">☕ Maybe grab a coffee while we figure this out?</span>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
