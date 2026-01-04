import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useRef, useState } from "react";

interface ProductSectionProps {
  title: string;
  products: {
    image: string;
    title: string;
    rating: number;
    reviewCount: number;
    soldCount?: string;
    price: number;
    originalPrice?: number;
    savePercent?: number;
    offerEndsIn?: string;
    stockLeft?: number;
    freeDeliveryMin?: number;
    deliveryDate?: string;
    seller?: string;
    badges?: ("bestseller" | "trending")[];
    colorVariants?: string[];
    isFavorite?: boolean;
    showStartRating?: boolean;
  }[];
}

export const ProductSection = ({ title, products }: ProductSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
          View all
        </button>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-card shadow-lg rounded-full flex items-center justify-center hover:bg-secondary transition-colors ${
            !canScrollLeft ? "opacity-30 cursor-not-allowed" : ""
          }`}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        {/* Products Container - Horizontal Scroll */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto py-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[calc(100vw-48px)] xs:w-[calc((100vw-48px)/2)] sm:w-[calc((100vw-64px)/3)] md:w-[calc((100vw-80px)/4)] lg:w-[calc((100vw-96px)/5)]"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-card shadow-lg rounded-full flex items-center justify-center hover:bg-secondary transition-colors ${
            !canScrollRight ? "opacity-30 cursor-not-allowed" : ""
          }`}
          disabled={!canScrollRight}
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-1 bg-border rounded-full max-w-md">
          <div className="h-1 bg-foreground rounded-full w-1/3" />
        </div>
      </div>
    </section>
  );
};
