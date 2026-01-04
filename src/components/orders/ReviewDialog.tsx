import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image as ImageIcon, X, Trash2 } from "lucide-react";
import type { ReviewTarget, ReviewPayload } from "@/types/orders";
import { StarRating } from "./StarRating";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: ReviewTarget | null;
  rating: number;
  text: string;
  images: string[];
  existingReview: ReviewPayload | undefined;
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating Section */}
          <div className="rounded-2xl border p-4 space-y-3">
            <div>
              <div className="text-sm font-semibold">Rating</div>
              <div className="text-sm text-muted-foreground">Slide to set your rating.</div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <StarRating value={rating} />
                  <div className="text-sm font-semibold">
                    {Number(rating || 0).toFixed(1)} / 5.0
                  </div>
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={Number.isFinite(rating) ? rating : 0}
                    onChange={(e) => onRatingChange(Number(e.target.value))}
                    className="rounded-xl text-center"
                  />
                </div>
              </div>

              <Slider
                value={[Number.isFinite(rating) ? rating : 0]}
                onValueChange={(values) => onRatingChange(values[0])}
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Text Review Section */}
          <div className="rounded-2xl border p-4 space-y-3">
            <div>
              <div className="text-sm font-semibold">Your review</div>
              <div className="text-sm text-muted-foreground">Short, specific feedback builds trust.</div>
            </div>
            <Textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="What went well? What should improve?"
              className="min-h-[110px] rounded-xl resize-none"
            />
          </div>

          {/* Images Section */}
          <div className="rounded-2xl border p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Add images</div>
                <div className="text-sm text-muted-foreground">Up to 8 photos.</div>
              </div>
              <label className="inline-flex cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onAddImages(e.target.files)}
                />
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  <ImageIcon className="h-4 w-4" /> Upload
                </span>
              </label>
            </div>

            {images.length ? (
              <div className="flex flex-wrap gap-2">
                {images.map((src) => (
                  <div key={src} className="relative group">
                    <img src={src} alt="Upload" className="h-16 w-16 rounded-xl border object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(src)}
                      className="absolute -right-2 -top-2 rounded-full border bg-background p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <label
                className="rounded-2xl border-2 border-dashed p-6 cursor-pointer hover:border-foreground/50 hover:bg-accent/50 transition-colors block"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("border-foreground", "bg-accent/50");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("border-foreground", "bg-accent/50");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-foreground", "bg-accent/50");
                  if (e.dataTransfer.files?.length) {
                    onAddImages(e.dataTransfer.files);
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onAddImages(e.target.files)}
                />
                <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                  <span>Drag & drop photos here or click to browse</span>
                </div>
              </label>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          {existingReview && (
            <Button
              variant="outline"
              className="rounded-xl gap-2"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}

          <Button className="rounded-xl" onClick={onSubmit} disabled={!(rating > 0)}>
            Submit review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
