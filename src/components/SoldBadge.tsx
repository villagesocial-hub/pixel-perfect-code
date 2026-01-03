import { cn } from "@/lib/utils";

interface SoldBadgeProps {
  count: string;
  className?: string;
}

export const SoldBadge = ({ count, className }: SoldBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 bg-secondary text-muted-foreground text-[11px] rounded",
        className
      )}
    >
      {count} sold
    </span>
  );
};
