import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Search } from "lucide-react";
import type { Order, ReviewTarget, DeleteTarget, ReviewPayload } from "@/types/orders";
import { useOrders } from "@/contexts/OrdersContext";
import { docText, safeFilename, downloadFile, nowStamp } from "@/lib/orders-utils";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderDetailSheet } from "@/components/orders/OrderDetailSheet";
import { ReviewDialog } from "@/components/orders/ReviewDialog";
import { DeleteConfirmDialog } from "@/components/orders/DeleteConfirmDialog";

export default function OrdersReviewsPage() {
  const { orders, updateOrderReview, updateItemReview, deleteOrderReview, deleteItemReview } = useOrders();
  const [query, setQuery] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(orders[0]?.id ?? "");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const selected = orders.find(o => o.id === selectedId) ?? orders[0];

  const filtered = orders.filter(o => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return o.number.toLowerCase().includes(q) || o.status.toLowerCase().includes(q) || o.items.some(it => it.name.toLowerCase().includes(q));
  });

  const openOrder = useCallback((orderId: string) => {
    setSelectedId(orderId);
    setDetailOpen(true);
  }, []);

  const openProduct = useCallback((url: string) => {
    alert(`Navigate to ${url}`);
  }, []);

  const downloadInvoice = useCallback((order: Order) => {
    downloadFile(`${safeFilename(order.number)} Invoice.pdf`, "application/pdf", docText(order));
  }, []);

  const downloadReceipt = useCallback((order: Order) => {
    downloadFile(`${safeFilename(order.number)} Receipt.pdf`, "application/pdf", docText(order));
  }, []);

  const getExistingReviewPayload = useCallback((t: ReviewTarget): ReviewPayload | undefined => {
    const order = orders.find(o => o.id === t.orderId);
    if (!order) return undefined;
    if (t.type === "order") return order.orderReview;
    return order.itemReviews?.[t.itemId];
  }, [orders]);

  const hydrateReviewModal = useCallback((t: ReviewTarget) => {
    const existing = getExistingReviewPayload(t);
    setReviewRating(existing?.rating ?? 0);
    setReviewTitle(existing?.title ?? "");
    setReviewText(existing?.text ?? "");
    setReviewImages(existing?.images ?? []);
  }, [getExistingReviewPayload]);

  const startReview = useCallback((t: ReviewTarget) => {
    const order = orders.find(o => o.id === t.orderId);
    if (!order || order.status !== "Delivered") return;
    setReviewTarget(t);
    hydrateReviewModal(t);
    setReviewOpen(true);
  }, [orders, hydrateReviewModal]);

  const handleStartOrderReview = useCallback((orderId: string) => {
    startReview({
      type: "order",
      orderId
    });
  }, [startReview]);

  const pickImages = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const urls = Array.from(files).map(f => URL.createObjectURL(f));
    setReviewImages(prev => [...prev, ...urls].slice(0, 8));
  }, []);

  const removeImage = useCallback((url: string) => {
    setReviewImages(prev => prev.filter(x => x !== url));
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }, []);

  const submitReview = useCallback(() => {
    if (!reviewTarget) return;
    const order = orders.find(o => o.id === reviewTarget.orderId);
    if (!order || order.status !== "Delivered") return;
    const value = Math.max(0, Math.min(5, Number(reviewRating)));
    const payload: ReviewPayload = {
      rating: value,
      title: reviewTitle.trim() || undefined,
      text: reviewText.trim() || undefined,
      images: reviewImages.length ? reviewImages : undefined,
      updatedAt: nowStamp()
    };
    
    if (reviewTarget.type === "order") {
      updateOrderReview(reviewTarget.orderId, payload);
    } else {
      updateItemReview(reviewTarget.orderId, reviewTarget.itemId, payload);
    }
    
    setReviewOpen(false);
    setReviewTarget(null);
  }, [reviewTarget, orders, reviewRating, reviewTitle, reviewText, reviewImages, updateOrderReview, updateItemReview]);

  const requestDelete = useCallback((t: DeleteTarget) => {
    setDeleteTarget(t);
    setConfirmDeleteOpen(true);
  }, []);

  const handleDeleteFromReviewDialog = useCallback(() => {
    if (!reviewTarget) return;
    const dt: DeleteTarget = reviewTarget.type === "order" ? {
      type: "order",
      orderId: reviewTarget.orderId
    } : {
      type: "item",
      orderId: reviewTarget.orderId,
      itemId: reviewTarget.itemId
    };
    setReviewOpen(false);
    requestDelete(dt);
  }, [reviewTarget, requestDelete]);

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === "order") {
      deleteOrderReview(deleteTarget.orderId);
    } else {
      deleteItemReview(deleteTarget.orderId, deleteTarget.itemId);
    }
    
    setConfirmDeleteOpen(false);
    setDeleteTarget(null);
  }, [deleteTarget, deleteOrderReview, deleteItemReview]);

  const handleReviewDialogOpenChange = useCallback((open: boolean) => {
    setReviewOpen(open);
    if (!open) {
      setReviewTarget(null);
      setReviewRating(0);
      setReviewTitle("");
      setReviewText("");
      setReviewImages([]);
    }
  }, []);

  const handleConfirmDeleteOpenChange = useCallback((open: boolean) => {
    setConfirmDeleteOpen(open);
    if (!open) setDeleteTarget(null);
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Orders & Reviews</h1>
              <p className="text-sm text-muted-foreground">
                Order history, downloads, and reviews in one place.
              </p>
            </div>

            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search orders..." className="pl-9 rounded-full" />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border p-6 text-center">
                <div className="text-sm font-semibold">No orders found</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Try a different search.
                </div>
              </div>
            ) : (
              filtered.map(o => (
                <OrderCard
                  key={o.id}
                  order={o}
                  onOpen={openOrder}
                  onDownloadInvoice={downloadInvoice}
                  onDownloadReceipt={downloadReceipt}
                  onStartReview={handleStartOrderReview}
                />
              ))
            )}
          </div>
        </div>

        {/* Order Detail Sheet */}
        <OrderDetailSheet
          open={detailOpen}
          onOpenChange={setDetailOpen}
          order={selected}
          onDownloadInvoice={downloadInvoice}
          onDownloadReceipt={downloadReceipt}
          onStartReview={startReview}
          onRequestDelete={requestDelete}
          onOpenProduct={openProduct}
        />

        {/* Review Dialog */}
        <ReviewDialog
          open={reviewOpen}
          onOpenChange={handleReviewDialogOpenChange}
          target={reviewTarget}
          rating={reviewRating}
          title={reviewTitle}
          text={reviewText}
          images={reviewImages}
          existingReview={reviewTarget ? getExistingReviewPayload(reviewTarget) : undefined}
          onRatingChange={setReviewRating}
          onTitleChange={setReviewTitle}
          onTextChange={setReviewText}
          onAddImages={pickImages}
          onRemoveImage={removeImage}
          onSubmit={submitReview}
          onDelete={handleDeleteFromReviewDialog}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={confirmDeleteOpen}
          onOpenChange={handleConfirmDeleteOpenChange}
          onConfirm={confirmDelete}
        />
      </div>
    </TooltipProvider>
  );
}
