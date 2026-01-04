import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";
import { useMemo } from "react";

const allSuggestedProducts = [
  {
    id: "suggest-1",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&h=200&fit=crop",
    title: "Microfiber Cleaning Cloths (12-Pack)",
    price: 12.99,
    seller: "CleanPro",
  },
  {
    id: "suggest-2",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop",
    title: "All-Purpose Cleaning Spray",
    price: 8.49,
    seller: "EcoClean",
  },
  {
    id: "suggest-3",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&h=200&fit=crop",
    title: "Rubber Cleaning Gloves",
    price: 6.99,
    seller: "HomeEssentials",
  },
  {
    id: "suggest-4",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
    title: "Stainless Steel Scrubber Set",
    price: 9.99,
    seller: "KitchenPro",
  },
  {
    id: "suggest-5",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&h=200&fit=crop",
    title: "Eco-Friendly Dish Soap",
    price: 7.49,
    seller: "GreenHome",
  },
];

export const FrequentlyBoughtTogether = () => {
  const { items, addToCart } = useCart();

  // Filter out products already in cart and show up to 3
  const suggestedProducts = useMemo(() => {
    const cartIds = new Set(items.map(item => item.id));
    return allSuggestedProducts
      .filter(product => !cartIds.has(product.id))
      .slice(0, 3);
  }, [items]);

  // Don't render if no suggestions available
  if (suggestedProducts.length === 0) {
    return null;
  }

  const totalPrice = suggestedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddAll = () => {
    suggestedProducts.forEach((product) => {
      addToCart(product);
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Frequently Bought Together
      </h3>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {suggestedProducts.map((product, index) => (
          <div key={product.id} className="flex items-center">
            <a 
              href={`/product/${product.id}`}
              className="w-20 h-20 bg-secondary/30 rounded-lg overflow-hidden block hover:ring-2 hover:ring-foreground/20 transition-all"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain p-2"
              />
            </a>
            {index < suggestedProducts.length - 1 && (
              <Plus className="w-4 h-4 text-muted-foreground mx-2" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total price:</p>
          <p className="text-xl font-bold text-foreground">
            ${totalPrice.toFixed(2)}
          </p>
        </div>
        <Button variant="cart" size="cart" onClick={handleAddAll}>
          Add all to cart
        </Button>
      </div>
    </div>
  );
};
