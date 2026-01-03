import { Link } from "react-router-dom";
import { ShoppingBag, Tag, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/components/CartItem";
import { FrequentlyBoughtTogether } from "@/components/FrequentlyBoughtTogether";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { items, getCartTotal, promoCode, promoDiscount, applyPromoCode } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const { toast } = useToast();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const discount = (subtotal * promoDiscount) / 100;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + shipping + tax;

  const handleApplyPromo = () => {
    if (applyPromoCode(promoInput)) {
      toast({
        title: "Promo code applied!",
        description: `You saved ${promoDiscount}% on your order.`,
      });
      setPromoInput("");
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check the code and try again.",
        variant: "destructive",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/">
          <Button variant="cart" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* Frequently Bought Together */}
          <div className="mt-8">
            <FrequentlyBoughtTogether />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-4 sticky top-20">
            <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>

            {/* Promo Code */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={handleApplyPromo}>
                  Apply
                </Button>
              </div>
              {promoCode && (
                <p className="text-sm text-save mt-2">
                  ✓ {promoCode} applied - {promoDiscount}% off
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-save">Discount ({promoDiscount}%)</span>
                  <span className="text-save">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Shipping
                </span>
                <span className="text-foreground">
                  {shipping === 0 ? (
                    <span className="text-save">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated tax</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-muted-foreground bg-secondary px-3 py-2 rounded">
                  Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              )}

              <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link to="/checkout" className="block mt-4">
              <Button variant="cart" size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>

            {/* Continue Shopping */}
            <Link to="/" className="block mt-3">
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
