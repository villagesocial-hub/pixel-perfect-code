import { Minus, Plus, Trash2, Bookmark, Truck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCart, CartItem as CartItemType } from "@/contexts/CartContext";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
  isSaved?: boolean;
}

export const CartItem = ({ item, isSaved = false }: CartItemProps) => {
  const { updateQuantity, removeFromCart, saveForLater, moveToCart, removeFromSaved } = useCart();
  const [quantityInput, setQuantityInput] = useState(item.quantity.toString());

  // Calculate savings per item
  const itemSavings = item.originalPrice
    ? (item.originalPrice - item.price) * item.quantity
    : 0;

  // Generate estimated delivery date (3-5 business days from now)
  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDays = Math.floor(Math.random() * 3) + 3; // 3-5 days
    today.setDate(today.getDate() + deliveryDays);
    return today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleQuantityChange = (value: string) => {
    setQuantityInput(value);
  };

  const handleQuantityBlur = () => {
    const newQuantity = parseInt(quantityInput, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setQuantityInput(item.quantity.toString());
    } else if (newQuantity > 99) {
      setQuantityInput("99");
      updateQuantity(item.id, 99);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuantityBlur();
    }
  };

  if (isSaved) {
    return (
      <div className="flex gap-4 p-4 bg-secondary/30 border border-border rounded-lg">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0 bg-secondary/30 rounded-lg overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain p-2"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
            {item.title}
          </h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-bold text-price">
              ${item.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="cart"
              size="sm"
              onClick={() => moveToCart(item.id)}
            >
              Move to Cart
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => removeFromSaved(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 bg-card border border-border rounded-lg">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-secondary/30 rounded-lg overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
          {item.title}
        </h3>
        {item.seller && (
          <p className="text-xs text-muted-foreground mb-1">
            Sold by {item.seller}
          </p>
        )}
        {item.options && item.options.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {item.options.map((option, idx) => (
              <span key={idx} className="text-xs bg-secondary/50 text-muted-foreground px-2 py-0.5 rounded">
                {option.type}: {option.value}
              </span>
            ))}
          </div>
        )}

        {/* Estimated Delivery */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Truck className="w-3 h-3" />
          <span>Get it by <span className="font-medium text-foreground">{getDeliveryDate()}</span></span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-price">
            ${item.price.toFixed(2)}
          </span>
          {item.originalPrice && (
            <span className="text-sm text-price-original line-through">
              ${item.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Savings Badge */}
        {itemSavings > 0 && (
          <p className="text-xs text-save font-medium mb-3">
            You save ${itemSavings.toFixed(2)}
          </p>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center border border-border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="text"
              value={quantityInput}
              onChange={(e) => handleQuantityChange(e.target.value)}
              onBlur={handleQuantityBlur}
              onKeyDown={handleQuantityKeyDown}
              className="w-12 h-8 text-center border-0 p-0 text-sm font-medium focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                updateQuantity(item.id, item.quantity + 1);
                setQuantityInput((item.quantity + 1).toString());
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => saveForLater(item.id)}
          >
            <Bookmark className="w-4 h-4 mr-1" />
            Save for later
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => removeFromCart(item.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>

      {/* Line Total */}
      <div className="hidden sm:block text-right">
        <p className="text-lg font-bold text-foreground">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
