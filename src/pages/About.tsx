import { Link } from "react-router-dom";
import { Truck, Clock, Shield, HeadphonesIcon, Package, CheckCircle, MapPin, CreditCard, RotateCcw, MessageCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import aboutHero from "@/assets/about-hero.avif";

const About = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutHero})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Shop with Confidence
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            We're committed to making your shopping experience seamless, secure, and satisfying. Here's what sets us apart.
          </p>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground text-sm">
              Quick and reliable shipping to get your orders to you as soon as possible.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Secure Shopping</h3>
            <p className="text-muted-foreground text-sm">
              Your information is protected with industry-standard security measures.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <HeadphonesIcon className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">24/7 Support</h3>
            <p className="text-muted-foreground text-sm">
              Our customer service team is always here to help with any questions.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
            Shipping & Delivery
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-6 flex gap-4">
              <Package className="w-6 h-6 text-foreground flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Careful Packaging</h4>
                <p className="text-sm text-muted-foreground">
                  Every order is carefully packaged to ensure your items arrive in perfect condition.
                </p>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6 flex gap-4">
              <Clock className="w-6 h-6 text-foreground flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Estimated Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  View estimated delivery dates for each item before you complete your order.
                </p>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6 flex gap-4">
              <MapPin className="w-6 h-6 text-foreground flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Order Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Track your order every step of the way from our warehouse to your doorstep.
                </p>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6 flex gap-4">
              <CreditCard className="w-6 h-6 text-foreground flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Cash on Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Pay when your order arrives. No upfront payment required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
            Our Promises
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4">
              <CheckCircle className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Quality Guaranteed</h4>
                <p className="text-sm text-muted-foreground">
                  We stand behind the quality of every product we sell. If something isn't right, we'll make it right.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <RotateCcw className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Easy Returns</h4>
                <p className="text-sm text-muted-foreground">
                  Changed your mind? No problem. We offer hassle-free returns on eligible items.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <Shield className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Authentic Products</h4>
                <p className="text-sm text-muted-foreground">
                  Every item is sourced from verified suppliers. We guarantee authenticity on all products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Support */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Need Help?
          </h2>
          <p className="text-muted-foreground mb-8">
            Our support team is ready to assist you with any questions or concerns.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-background rounded-full px-4 py-2">
              <MessageCircle className="w-4 h-4 text-foreground" />
              <span className="text-sm text-foreground">Live Chat</span>
            </div>
            <div className="flex items-center gap-2 bg-background rounded-full px-4 py-2">
              <Mail className="w-4 h-4 text-foreground" />
              <span className="text-sm text-foreground">support@kwixi.com</span>
            </div>
            <div className="flex items-center gap-2 bg-background rounded-full px-4 py-2">
              <Phone className="w-4 h-4 text-foreground" />
              <span className="text-sm text-foreground">1-800-KWIXI</span>
            </div>
          </div>
          <Button asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;