import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const recommendations = [
  {
    id: "rec-1",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&h=200&fit=crop",
    title: "Microfiber Cleaning Cloths (12-Pack)",
    price: 12.99,
  },
  {
    id: "rec-2",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop",
    title: "All-Purpose Cleaning Spray",
    price: 8.49,
  },
  {
    id: "rec-3",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&h=200&fit=crop",
    title: "Rubber Cleaning Gloves",
    price: 6.99,
  },
  {
    id: "rec-4",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
    title: "Electric Spin Scrubber",
    price: 45.99,
  },
];

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "ORD-XXXXXX";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-save/10 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-save" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-4">
          Thank you for your purchase. We've sent a confirmation email with your order details.
        </p>
        <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
          <Package className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Order Number: <span className="font-bold">{orderNumber}</span>
          </span>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-foreground mb-4">What's Next?</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-sm font-bold">1</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Order Processing</h3>
              <p className="text-sm text-muted-foreground">We're preparing your order for shipment.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-muted-foreground text-sm font-bold">2</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Shipped</h3>
              <p className="text-sm text-muted-foreground">You'll receive a tracking number via email.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-muted-foreground text-sm font-bold">3</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Delivered</h3>
              <p className="text-sm text-muted-foreground">Your order arrives at your doorstep!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-square bg-secondary/30">
                <img src={product.image} alt={product.title} className="w-full h-full object-contain p-3" />
              </div>
              <div className="p-3">
                <h3 className="text-sm text-foreground line-clamp-2 mb-1">{product.title}</h3>
                <p className="text-lg font-bold text-price">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/">
          <Button variant="cart" size="lg" className="w-full sm:w-auto">
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
