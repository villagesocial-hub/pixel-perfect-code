import { Link } from "react-router-dom";
import { Truck, MapPin, Clock, Package, Banknote, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeliveryInfo = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      {/* Header */}
      <section className="bg-muted/30 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/about" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to About
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Shipping & Delivery
          </h1>
          <p className="text-muted-foreground">
            Everything you need to know about how we deliver to you
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Delivery Area */}
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Delivery Area</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  We currently deliver exclusively within <strong className="text-foreground">Lebanon</strong>. All regions and cities across the country are covered by our delivery network.
                </p>
                <div className="bg-background rounded-md p-3 inline-block">
                  <span className="text-sm font-medium text-foreground">🇱🇧 Lebanon Nationwide</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                <Banknote className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Payment Method</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  We accept <strong className="text-foreground">Cash on Delivery</strong> only. Pay for your order when it arrives at your doorstep — no upfront payment required.
                </p>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                    No credit card needed
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                    Pay in Lebanese Pounds or USD
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                    Please have exact change ready
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Delivery Time</h2>
                <ul className="text-muted-foreground text-sm leading-relaxed space-y-2">
                  <li>• <strong>Beirut & Mount Lebanon:</strong> 1-2 business days</li>
                  <li>• <strong>Other regions:</strong> 2-4 business days</li>
                  <li>• Orders placed before 2 PM are processed the same day</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Delivery Process */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Delivery Process</h2>
                <ol className="text-muted-foreground text-sm leading-relaxed space-y-2">
                  <li><strong>1.</strong> Place your order and receive a confirmation</li>
                  <li><strong>2.</strong> Our team prepares and packages your items</li>
                  <li><strong>3.</strong> You'll receive a call before delivery</li>
                  <li><strong>4.</strong> Pay cash upon receiving your order</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Packaging */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Careful Packaging</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every order is carefully packaged to ensure your items arrive in perfect condition. Fragile items receive extra protection.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Questions?</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  If you have any questions about delivery, please contact us at{" "}
                  <a href="mailto:contact@karimax.com" className="text-foreground underline">contact@karimax.com</a> or call <strong className="text-foreground">70 222 333</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="pt-6">
            <Button asChild variant="outline">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveryInfo;
