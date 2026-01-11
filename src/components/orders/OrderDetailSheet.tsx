import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  MessageCircle,
  Star,
  Pencil,
  Trash2,
  ExternalLink,
  Eye
} from "lucide-react";
import type { Order, ReviewTarget, DeleteTarget } from "@/types/orders";
import { formatMoney, statusTone, makeSvgThumbDataUrl } from "@/lib/orders-utils";
import { StatusIcon } from "./StatusIcon";
import { StarRating } from "./StarRating";

interface OrderDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onDownloadInvoice: (order: Order) => void;
  onStartReview: (target: ReviewTarget) => void;
  onRequestDelete: (target: DeleteTarget) => void;
  onOpenProduct: (url: string) => void;
}

export function OrderDetailSheet({
  open,
  onOpenChange,
  order,
  onDownloadInvoice,
  onStartReview,
  onRequestDelete,
  onOpenProduct,
}: OrderDetailSheetProps) {
  if (!order) return null;

  const canReview = order.status === "Delivered";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order details</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Order Info Card */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">{order.number}</CardTitle>
                  <div className="mt-1 text-sm text-muted-foreground">{order.date}</div>
                </div>
                <Badge variant={statusTone(order.status)} className="gap-1.5">
                  <StatusIcon status={order.status} />
                  <span>{order.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border p-3">
                  <div className="text-xs text-muted-foreground">Payment</div>
                  <div className="text-sm font-semibold">{order.paymentMethod}</div>
                </div>
                <div className="rounded-2xl border p-3">
                  <div className="text-xs text-muted-foreground">Total</div>
                  <div className="text-sm font-semibold">{formatMoney(order.total)}</div>
                </div>
              </div>

              <div className="rounded-2xl border p-3">
                <div className="text-xs text-muted-foreground">Delivery address</div>
                <div className="text-sm font-semibold">{order.address}</div>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl gap-2"
                  onClick={() => onDownloadInvoice(order)}
                >
                  <FileText className="h-4 w-4" /> Download invoice
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl gap-2"
                  onClick={() => alert("Support flow would open here")}
                >
                  <MessageCircle className="h-4 w-4" /> Contact support
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Review Card */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">Order review</CardTitle>
                {canReview ? (
                  order.orderReview ? (
                    <Badge variant="secondary" className="gap-1.5">
                      <Star className="h-4 w-4" /> Reviewed
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not reviewed</Badge>
                  )
                ) : (
                  <Badge variant="outline">Available after delivery</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {!canReview ? (
                <div className="text-sm text-muted-foreground">
                  You can review this order once it has been delivered.
                </div>
              ) : order.orderReview ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <StarRating value={order.orderReview.rating} />
                    <div className="text-sm font-semibold">
                      {order.orderReview.rating.toFixed(1)} / 5.0
                    </div>
                  </div>
                  {order.orderReview.text ? (
                    <div className="text-sm text-muted-foreground">{order.orderReview.text}</div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No written review</div>
                  )}
                  {order.orderReview.images?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {order.orderReview.images.map((src) => (
                        <img
                          key={src}
                          src={src}
                          alt="Review"
                          className="h-14 w-14 rounded-xl border object-cover"
                        />
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="rounded-xl gap-2"
                      onClick={() => onStartReview({ type: "order", orderId: order.id })}
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl gap-2"
                      onClick={() => onRequestDelete({ type: "order", orderId: order.id })}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="rounded-xl gap-2"
                  onClick={() => onStartReview({ type: "order", orderId: order.id })}
                >
                  <Star className="h-4 w-4" /> Review order
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Items Card */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => {
                const itemReview = order.itemReviews?.[item.id];
                const disabled = order.status !== "Delivered";

                return (
                  <div key={item.id} className="rounded-2xl border p-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenProduct(item.productUrl)}
                        className="h-14 w-14 overflow-hidden rounded-2xl border bg-muted flex-shrink-0"
                        aria-label={`Open ${item.name}`}
                      >
                        <img
                          src={item.imageUrl || makeSvgThumbDataUrl(item.name)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = makeSvgThumbDataUrl(item.name);
                          }}
                        />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.variant}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">{formatMoney(item.price)}</div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">Qty {item.qty}</div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {itemReview ? (
                            <Badge variant="secondary" className="gap-1.5">
                              <Star className="h-4 w-4" /> Reviewed
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not reviewed</Badge>
                          )}

                          {itemReview && (
                            <div className="flex items-center gap-2">
                              <StarRating value={itemReview.rating} />
                              <div className="text-sm text-muted-foreground">
                                {itemReview.rating.toFixed(1)}
                              </div>
                            </div>
                          )}

                          <div className="ml-auto flex flex-wrap gap-2">
                            {itemReview ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl gap-2"
                                  onClick={() =>
                                    onStartReview({ type: "item", orderId: order.id, itemId: item.id })
                                  }
                                >
                                  <Eye className="h-4 w-4" /> View
                                </Button>
                                <Button
                                  size="sm"
                                  className="rounded-xl gap-2"
                                  onClick={() =>
                                    onStartReview({ type: "item", orderId: order.id, itemId: item.id })
                                  }
                                >
                                  <Pencil className="h-4 w-4" /> Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl gap-2"
                                  onClick={() =>
                                    onRequestDelete({ type: "item", orderId: order.id, itemId: item.id })
                                  }
                                >
                                  <Trash2 className="h-4 w-4" /> Delete
                                </Button>
                              </>
                            ) : disabled ? (
                              <Button variant="outline" size="sm" className="rounded-xl gap-2" disabled>
                                <Star className="h-4 w-4" /> Review item
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="rounded-xl gap-2"
                                onClick={() =>
                                  onStartReview({ type: "item", orderId: order.id, itemId: item.id })
                                }
                              >
                                <Star className="h-4 w-4" /> Review item
                              </Button>
                            )}
                          </div>
                        </div>

                        {itemReview && (
                          <div className="mt-3 pt-3 border-t">
                            {itemReview.text ? (
                              <div className="text-sm text-muted-foreground">{itemReview.text}</div>
                            ) : (
                              <div className="text-sm text-muted-foreground">No written review</div>
                            )}
                            {itemReview.images?.length ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {itemReview.images.map((src) => (
                                  <img
                                    key={src}
                                    src={src}
                                    alt="Review"
                                    className="h-14 w-14 rounded-xl border object-cover"
                                  />
                                ))}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
