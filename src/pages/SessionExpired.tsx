import { Link } from "react-router-dom";
import { Home, LogIn, Clock, Timer, Lock, Unlock, Key, KeyRound, Shield, ShieldCheck, ShieldOff, UserX, LogOut, RefreshCw, RotateCw, History, AlarmClock, Hourglass, TimerOff, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingIcons = [
  // Left side - spread vertically
  { Icon: Clock, className: "top-[5%] left-[6%] w-8 h-8 rotate-[-15deg]" },
  { Icon: Key, className: "top-[18%] left-[12%] w-7 h-7 rotate-[8deg]" },
  { Icon: Lock, className: "top-[32%] left-[4%] w-6 h-6 rotate-[-25deg]" },
  { Icon: Shield, className: "top-[45%] left-[14%] w-9 h-9 rotate-[-22deg]" },
  { Icon: Timer, className: "top-[58%] left-[5%] w-8 h-8 rotate-[-5deg]" },
  { Icon: KeyRound, className: "top-[70%] left-[11%] w-7 h-7 rotate-[18deg]" },
  { Icon: Hourglass, className: "top-[82%] left-[4%] w-8 h-8 rotate-[-20deg]" },
  
  // Right side - spread vertically
  { Icon: ShieldOff, className: "top-[6%] right-[8%] w-10 h-10 rotate-[20deg]" },
  { Icon: AlarmClock, className: "top-[19%] right-[14%] w-7 h-7 rotate-[-18deg]" },
  { Icon: Unlock, className: "top-[33%] right-[5%] w-7 h-7 rotate-[-10deg]" },
  { Icon: LogOut, className: "top-[46%] right-[12%] w-9 h-9 rotate-[-12deg]" },
  { Icon: History, className: "top-[59%] right-[6%] w-6 h-6 rotate-[-15deg]" },
  { Icon: TimerOff, className: "top-[71%] right-[13%] w-7 h-7 rotate-[28deg]" },
  { Icon: UserX, className: "top-[83%] right-[7%] w-10 h-10 rotate-[-8deg]" },
  
  // Extra scattered - hidden on mobile
  { Icon: ShieldCheck, className: "top-[10%] right-[22%] w-8 h-8 rotate-[5deg] hidden md:block" },
  { Icon: RefreshCw, className: "top-[25%] left-[20%] w-6 h-6 rotate-[12deg] hidden md:block" },
  { Icon: Lock, className: "top-[40%] right-[20%] w-6 h-6 rotate-[-8deg] hidden md:block" },
  { Icon: RotateCw, className: "top-[55%] left-[18%] w-8 h-8 rotate-[15deg] hidden md:block" },
  { Icon: Key, className: "top-[68%] right-[20%] w-6 h-6 rotate-[22deg] hidden md:block" },
  { Icon: Clock, className: "top-[80%] left-[18%] w-6 h-6 rotate-[-20deg] hidden md:block" },
  { Icon: UserCheck, className: "top-[12%] left-[26%] w-7 h-7 rotate-[12deg] hidden lg:block" },
  { Icon: Shield, className: "top-[75%] right-[24%] w-8 h-8 rotate-[-25deg] hidden lg:block" },
];

const SessionExpired = () => {
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
        {/* Session Expired Icon */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-2">
            <TimerOff className="w-16 h-16 text-gray-500" />
            <Lock className="w-14 h-14 text-gray-500" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Session Expired
        </h2>
        <p className="text-muted-foreground mb-4">
          Your session has expired due to inactivity. For your security, we've logged you out.
        </p>
        <p className="text-muted-foreground mb-8">
          Please sign in again to continue shopping.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link to="/">
              <LogIn className="w-4 h-4" />
              Sign in again
            </Link>
          </Button>
        </div>

        {/* Security note */}
        <div className="mt-8 bg-muted/50 rounded-lg px-4 py-3 inline-block">
          <p className="text-sm text-muted-foreground">
            Sessions expire after <span className="font-medium text-foreground">30 minutes</span> of inactivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;