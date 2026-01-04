import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { X, ImagePlus, Trash2 } from "lucide-react";
import type { ReviewTarget, ReviewPayload } from "@/types/orders";
import { OrderStarRating } from "./OrderStarRating";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: ReviewTarget | null;
  rating: number;
  text: string;
  images: string[];
  existingReview?: ReviewPayload;
  onRatingChange: (rating: number) => void;
  onTextChange: (text: string) => void;
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (url: string) => void;
  onSubmit: () => void;
  onDelete: () => void;
}

export function ReviewDialog({
  open,
  onOpenChange,
  target,
  rating,
  text,
  images,
  existingReview,
  onRatingChange,
  onTextChange,
  onAddImages,
  onRemoveImage,
  onSubmit,
  onDelete,
}: ReviewDialogProps) {
  if (!target) return null;

  const isEditing = !!existingReview;
  const title = target.type === "order" ? "Review Order" : "Review Item";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Tap to rate</span>
            <OrderStarRating value={rating} onChange={onRatingChange} interactive />
          </div>

          {/* Text Review */}
          <Textarea
            placeholder="Share your experience (optional)"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-[100px] resize-none rounded-xl"
          />

          {/* Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onAddImages(e.target.files)}
                />
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed hover:bg-muted/50 transition">
                  <ImagePlus className="h-4 w-4" />
                  <span className="text-sm">Add photos</span>
                </div>
              </label>
              <span className="text-xs text-muted-foreground">{images.length}/8</span>
            </div>

            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((url) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt="Review"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => onRemoveImage(url)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 flex-row">
          {isEditing && (
            <Button
              variant="outline"
              className="rounded-xl text-destructive hover:text-destructive gap-2"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="rounded-xl" onClick={onSubmit} disabled={rating === 0}>
            {isEditing ? "Update" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
