import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Star, MoreVertical } from "lucide-react";
import type { Order } from "@/types/orders";
import { formatMoney, statusTone, reviewedCounts, reviewDisabledReason } from "@/lib/orders-utils";
import { StatusIcon } from "./StatusIcon";
import { StarRating } from "./StarRating";

interface OrderCardProps {
  order: Order;
  onOpen: (orderId: string) => void;
  onDownloadInvoice: (order: Order) => void;
  onStartReview: (orderId: string) => void;
}

export function OrderCard({
  order,
  onOpen,
  onDownloadInvoice,
  onStartReview
}: OrderCardProps) {
  const { itemReviewed, itemsTotal, orderReviewed } = reviewedCounts(order);
  const reviewDisabled = order.status !== "Delivered";
  const tooltip = reviewDisabledReason(order);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(order.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(order.id);
        }
      }}
      className="w-full rounded-2xl border bg-card p-4 text-left transition cursor-pointer hover:bg-muted/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{order.number}</div>
          <div className="text-xs text-muted-foreground">{order.date}</div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Badge variant={statusTone(order.status)} className="gap-1.5">
            <StatusIcon status={order.status} />
            <span>{order.status}</span>
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl h-8 w-8" aria-label="Actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onDownloadInvoice(order)} className="gap-2">
                <FileText className="h-4 w-4" /> Download invoice
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DropdownMenuItem
                      className={`gap-2 ${reviewDisabled ? "opacity-50 pointer-events-none" : ""}`}
                      onClick={() => onStartReview(order.id)}
                    >
                      <Star className="h-4 w-4" /> Review
                    </DropdownMenuItem>
                  </div>
                </TooltipTrigger>
                {reviewDisabled && (
                  <TooltipContent>
                    <div className="text-xs">{tooltip}</div>
                  </TooltipContent>
                )}
              </Tooltip>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">{formatMoney(order.total)}</div>
        <div className="text-xs text-muted-foreground">{order.items.length} items</div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {orderReviewed ? (
          <div className="flex items-center gap-2">
            <StarRating value={order.orderReview!.rating} />
            <span className="text-xs font-medium text-muted-foreground">
              {order.orderReview!.rating.toFixed(1)}
            </span>
          </div>
        ) : (
          <Badge variant="outline">Order not reviewed</Badge>
        )}

        <Badge variant="outline">
          Items reviewed {itemReviewed}/{itemsTotal}
        </Badge>
      </div>
    </div>
  );
}
