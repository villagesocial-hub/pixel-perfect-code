import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useRef, useState } from "react";

const products = [
  {
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
    title: "O-Cedar EasyWring Spin Mop & Bucket System with Foot Pehandale...",
    rating: 3.2,
    reviewCount: 452,
    soldCount: "1.3k+",
    price: 27.75,
    originalPrice: 41.40,
    savePercent: 17,
    offerEndsIn: "3h 45m",
    freeDeliveryMin: 50,
    deliveryDate: "Dec 22 - Jan 8",
    seller: "Karimax",
    badges: ["bestseller", "trending"] as ("bestseller" | "trending")[],
    colorVariants: ["#6B46C1", "#3B82F6", "#1E3A8A"],
  },
  {
    image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400&h=400&fit=crop",
    title: "Electric Spin Scrubber - Cordless Cleaning Brush with Digital Display I...",
    rating: 4.1,
    reviewCount: 2300,
    soldCount: "736+",
    price: 45.23,
    originalPrice: 75.00,
    savePercent: 15,
    offerEndsIn: "1h 45m",
    stockLeft: 3,
    freeDeliveryMin: 50,
    deliveryDate: "Mon, Nov 29",
    seller: "ElectroSLab Company",
    badges: ["bestseller"] as ("bestseller" | "trending")[],
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    title: "BISSELL Little Green Mini Portable Carpet and Upholstery As Cleaning...",
    rating: 4.3,
    reviewCount: 100,
    soldCount: "2.5k+",
    price: 203.49,
    freeDeliveryMin: 50,
    deliveryDate: "Mon, Nov 24",
    seller: "Younes Leader House",
    isFavorite: true,
  },
  {
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    title: "11Pcs Crevice Cleaning Brush Set, Hard Bristle Cleaning Supplies for Y...",
    rating: 0,
    reviewCount: 0,
    price: 10.05,
    originalPrice: 15.23,
    savePercent: 22,
    stockLeft: 4,
    freeDeliveryMin: 50,
    deliveryDate: "Mon, Nov 24",
    seller: "Beirut ElectroCity",
    badges: ["bestseller", "trending"] as ("bestseller" | "trending")[],
    showStartRating: true,
    isFavorite: true,
  },
  {
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    title: "Cordless Cleaning, Electric Spin Scrubber, Brush Scrubber for Hom...",
    rating: 5,
    reviewCount: 300,
    soldCount: "528+",
    price: 9.33,
    originalPrice: 20.34,
    savePercent: 10,
    freeDeliveryMin: 50,
    deliveryDate: "Mon, Nov 28",
    seller: "Hamdan Electronics",
  },
];

export const TrendingDeals = () => {
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
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-bold text-primary">Trending Deals</h2>
        <button className="text-sm text-foreground hover:text-primary transition-colors">
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
          className="flex gap-4 overflow-x-auto px-4 py-2 scroll-smooth"
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
      <div className="mt-4 px-4">
        <div className="h-1 bg-border rounded-full max-w-md">
          <div className="h-1 bg-foreground rounded-full w-1/3" />
        </div>
      </div>
    </section>
  );
};
