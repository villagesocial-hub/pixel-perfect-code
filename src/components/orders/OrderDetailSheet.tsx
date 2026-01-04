import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Receipt, Star, MapPin, CreditCard, ExternalLink } from "lucide-react";
import type { Order, ReviewTarget, DeleteTarget } from "@/types/orders";
import { formatMoney, statusTone, reviewedCounts } from "@/lib/orders-utils";
import { StatusIcon } from "./StatusIcon";
import { OrderStarRating } from "./OrderStarRating";

interface OrderDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | undefined;
  onDownloadInvoice: (order: Order) => void;
  onDownloadReceipt: (order: Order) => void;
  onStartReview: (target: ReviewTarget) => void;
  onRequestDelete: (target: DeleteTarget) => void;
  onOpenProduct: (url: string) => void;
}

export function OrderDetailSheet({
  open,
  onOpenChange,
  order,
  onDownloadInvoice,
  onDownloadReceipt,
  onStartReview,
  onRequestDelete,
  onOpenProduct,
}: OrderDetailSheetProps) {
  if (!order) return null;

  const { orderReviewed } = reviewedCounts(order);
  const canReview = order.status === "Delivered";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <span>{order.number}</span>
            <Badge variant={statusTone(order.status)} className="gap-1.5">
              <StatusIcon status={order.status} />
              {order.status}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Order Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{order.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>{order.paymentMethod}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Ordered on {order.date}
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-4">
            <h3 className="font-semibold">Items ({order.items.length})</h3>
            {order.items.map((item) => {
              const itemReview = order.itemReviews?.[item.id];
              return (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl border bg-card/50">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-secondary cursor-pointer"
                    onClick={() => onOpenProduct(item.productUrl)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-sm line-clamp-2">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.variant} × {item.qty}</div>
                        <div className="text-sm font-medium mt-1">{formatMoney(item.price)}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onOpenProduct(item.productUrl)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    {itemReview && (
                      <div className="mt-2 pt-2 border-t">
                        <OrderStarRating value={itemReview.rating} />
                        {itemReview.text && (
                          <p className="text-xs text-muted-foreground mt-1">{itemReview.text}</p>
                        )}
                      </div>
                    )}
                    {canReview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 text-xs gap-1"
                        onClick={() => onStartReview({ type: "item", orderId: order.id, itemId: item.id })}
                      >
                        <Star className="h-3 w-3" />
                        {itemReview ? "Edit review" : "Review item"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Order Total */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold">{formatMoney(order.total)}</span>
          </div>

          {/* Order Review */}
          {order.orderReview && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Your Order Review</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive h-7 text-xs"
                    onClick={() => onRequestDelete({ type: "order", orderId: order.id })}
                  >
                    Delete
                  </Button>
                </div>
                <OrderStarRating value={order.orderReview.rating} />
                {order.orderReview.text && (
                  <p className="text-sm text-muted-foreground">{order.orderReview.text}</p>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => onDownloadInvoice(order)}
            >
              <FileText className="h-4 w-4" />
              Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => onDownloadReceipt(order)}
            >
              <Receipt className="h-4 w-4" />
              Receipt
            </Button>
            {canReview && (
              <Button
                variant="default"
                size="sm"
                className="gap-2 rounded-xl"
                onClick={() => onStartReview({ type: "order", orderId: order.id })}
              >
                <Star className="h-4 w-4" />
                {orderReviewed ? "Edit Review" : "Review Order"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
