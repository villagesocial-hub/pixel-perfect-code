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
import { FileText, Receipt, Star, MoreVertical } from "lucide-react";
import type { Order } from "@/types/orders";
import { formatMoney, statusTone, reviewedCounts } from "@/lib/orders-utils";
import { StatusIcon } from "./StatusIcon";
import { OrderStarRating } from "./OrderStarRating";

interface OrderCardProps {
  order: Order;
  onOpen: (orderId: string) => void;
  onDownloadInvoice: (order: Order) => void;
  onDownloadReceipt: (order: Order) => void;
  onStartReview: (orderId: string) => void;
}

export function OrderCard({
  order,
  onOpen,
  onDownloadInvoice,
  onDownloadReceipt,
  onStartReview,
}: OrderCardProps) {
  const { orderReviewed } = reviewedCounts(order);
  const reviewDisabled = order.status !== "Delivered";

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
              <DropdownMenuItem onClick={() => onDownloadReceipt(order)} className="gap-2">
                <Receipt className="h-4 w-4" /> Download receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onStartReview(order.id)}
                disabled={reviewDisabled}
                className="gap-2"
              >
                <Star className="h-4 w-4" />
                {orderReviewed ? "Edit review" : "Write a review"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Items Preview */}
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex-shrink-0">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover bg-secondary"
            />
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground">
            +{order.items.length - 3}
          </div>
        )}
      </div>

      {/* Order Total and Review */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm font-medium">{formatMoney(order.total)}</div>
        {order.orderReview && (
          <OrderStarRating value={order.orderReview.rating} />
        )}
      </div>
    </div>
  );
}
