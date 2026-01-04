import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useRef, useState } from "react";

const products = [
  {
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
    title: "O-Cedar EasyWring Spin Mop & Bucket System with Foot Pedal",
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
    title: "Electric Spin Scrubber - Cordless Cleaning Brush with Digital Display",
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
    title: "BISSELL Little Green Mini Portable Carpet and Upholstery Cleaner",
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
    title: "11Pcs Crevice Cleaning Brush Set, Hard Bristle Cleaning Supplies",
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
    title: "Cordless Cleaning, Electric Spin Scrubber, Brush Scrubber for Home",
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
  {
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop",
    title: "Microfiber Cleaning Cloths 12-Pack Premium Quality Towels",
    rating: 4.7,
    reviewCount: 1890,
    soldCount: "5k+",
    price: 12.99,
    originalPrice: 19.99,
    savePercent: 35,
    freeDeliveryMin: 50,
    deliveryDate: "Tue, Nov 30",
    seller: "CleanPro Store",
    badges: ["bestseller"] as ("bestseller" | "trending")[],
  },
  {
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    title: "All-Purpose Cleaning Spray Multi-Surface Antibacterial Formula",
    rating: 4.2,
    reviewCount: 567,
    price: 8.49,
    freeDeliveryMin: 50,
    deliveryDate: "Wed, Dec 1",
    seller: "Home Essentials",
    colorVariants: ["#22C55E", "#3B82F6", "#EAB308"],
  },
  {
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop",
    title: "Heavy Duty Rubber Cleaning Gloves Reusable Kitchen Dishwashing",
    rating: 4.5,
    reviewCount: 234,
    soldCount: "890+",
    price: 6.99,
    originalPrice: 9.99,
    savePercent: 30,
    stockLeft: 7,
    freeDeliveryMin: 50,
    deliveryDate: "Thu, Dec 2",
    seller: "SafeHands Co",
  },
  {
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=400&fit=crop",
    title: "Extendable Duster with Microfiber Head for Ceiling Fans and Blinds",
    rating: 4.0,
    reviewCount: 445,
    price: 15.75,
    originalPrice: 22.00,
    savePercent: 28,
    offerEndsIn: "5h 30m",
    freeDeliveryMin: 50,
    deliveryDate: "Fri, Dec 3",
    seller: "DustAway",
    badges: ["trending"] as ("bestseller" | "trending")[],
  },
  {
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop",
    title: "Steam Mop Floor Cleaner with 2 Washable Pads Hardwood Tile",
    rating: 4.6,
    reviewCount: 1234,
    soldCount: "3.2k+",
    price: 89.99,
    originalPrice: 129.99,
    savePercent: 31,
    freeDeliveryMin: 50,
    deliveryDate: "Sat, Dec 4",
    seller: "SteamClean Pro",
    badges: ["bestseller", "trending"] as ("bestseller" | "trending")[],
  },
  {
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=400&fit=crop",
    title: "Vacuum Cleaner Cordless Stick Lightweight Powerful Suction",
    rating: 4.4,
    reviewCount: 2100,
    soldCount: "4.1k+",
    price: 159.00,
    originalPrice: 249.00,
    savePercent: 36,
    freeDeliveryMin: 50,
    deliveryDate: "Sun, Dec 5",
    seller: "VacuumWorld",
    colorVariants: ["#1E3A8A", "#DC2626", "#16A34A"],
  },
  {
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&h=400&fit=crop",
    title: "Bathroom Scrub Brush with Long Handle Tile Grout Cleaner",
    rating: 3.9,
    reviewCount: 178,
    price: 11.25,
    stockLeft: 5,
    freeDeliveryMin: 50,
    deliveryDate: "Mon, Dec 6",
    seller: "BathClean",
  },
  {
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    title: "Glass Cleaner Spray Streak-Free Shine for Windows and Mirrors",
    rating: 4.3,
    reviewCount: 890,
    soldCount: "1.8k+",
    price: 5.99,
    freeDeliveryMin: 50,
    deliveryDate: "Tue, Dec 7",
    seller: "CrystalClear",
    badges: ["trending"] as ("bestseller" | "trending")[],
  },
  {
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop",
    title: "Dish Soap Liquid Concentrated Formula Cuts Grease Fast",
    rating: 4.8,
    reviewCount: 3456,
    soldCount: "10k+",
    price: 3.49,
    freeDeliveryMin: 50,
    deliveryDate: "Wed, Dec 8",
    seller: "KitchenPro",
    badges: ["bestseller"] as ("bestseller" | "trending")[],
  },
  {
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=400&fit=crop",
    title: "Trash Can Stainless Steel Step Pedal Kitchen Garbage Bin 13 Gallon",
    rating: 4.1,
    reviewCount: 567,
    soldCount: "920+",
    price: 45.00,
    originalPrice: 65.00,
    savePercent: 31,
    freeDeliveryMin: 50,
    deliveryDate: "Thu, Dec 9",
    seller: "HomeStyle",
    colorVariants: ["#71717A", "#1E3A8A", "#78716C"],
  },
  {
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    title: "Toilet Bowl Cleaner Gel Fresh Scent with Angled Neck Bottle",
    rating: 4.0,
    reviewCount: 234,
    price: 4.29,
    freeDeliveryMin: 50,
    deliveryDate: "Fri, Dec 10",
    seller: "FreshBath",
  },
  {
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    title: "Laundry Detergent Pods 3-in-1 Spring Fresh 96 Count",
    rating: 4.7,
    reviewCount: 4521,
    soldCount: "15k+",
    price: 24.99,
    originalPrice: 32.99,
    savePercent: 24,
    offerEndsIn: "2h 15m",
    freeDeliveryMin: 50,
    deliveryDate: "Sat, Dec 11",
    seller: "LaundryKing",
    badges: ["bestseller", "trending"] as ("bestseller" | "trending")[],
  },
  {
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop",
    title: "Fabric Softener Liquid Fresh Lavender Scent 150 Loads",
    rating: 4.5,
    reviewCount: 1234,
    soldCount: "2.8k+",
    price: 12.49,
    freeDeliveryMin: 50,
    deliveryDate: "Sun, Dec 12",
    seller: "SoftTouch",
  },
  {
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=400&fit=crop",
    title: "Air Freshener Automatic Spray Refills Ocean Breeze 3-Pack",
    rating: 4.2,
    reviewCount: 678,
    soldCount: "1.5k+",
    price: 18.99,
    originalPrice: 24.99,
    savePercent: 24,
    stockLeft: 8,
    freeDeliveryMin: 50,
    deliveryDate: "Mon, Dec 13",
    seller: "FreshAir Co",
    colorVariants: ["#0EA5E9", "#A855F7", "#F97316"],
  },
  {
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop",
    title: "Robot Vacuum Cleaner Smart Mapping WiFi Connected Self-Charging",
    rating: 4.6,
    reviewCount: 3890,
    soldCount: "8.5k+",
    price: 299.00,
    originalPrice: 449.00,
    savePercent: 33,
    offerEndsIn: "12h 00m",
    freeDeliveryMin: 50,
    deliveryDate: "Tue, Dec 14",
    seller: "SmartHome Hub",
    badges: ["bestseller", "trending"] as ("bestseller" | "trending")[],
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
    <section className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Trending Deals</h2>
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
