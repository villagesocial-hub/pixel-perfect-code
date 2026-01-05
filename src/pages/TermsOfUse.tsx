import { Link } from "react-router-dom";
import { FileText, ShoppingBag, CreditCard, Truck, RotateCcw, AlertCircle, Scale, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfUse = () => {
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
            Terms of Use
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 5, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Acceptance */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Acceptance of Terms</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  By accessing or using the Kwixi website and services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.
                </p>
              </div>
            </div>
          </div>

          {/* Using Our Services */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Using Our Services</h2>
                <ul className="text-muted-foreground text-sm leading-relaxed space-y-2">
                  <li>• You must be at least 18 years old to make purchases.</li>
                  <li>• You are responsible for maintaining the confidentiality of your account.</li>
                  <li>• You agree to provide accurate and complete information when creating an account or placing orders.</li>
                  <li>• You may not use our services for any illegal or unauthorized purpose.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Orders and Payment */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Orders and Payment</h2>
                <ul className="text-muted-foreground text-sm leading-relaxed space-y-2">
                  <li>• All prices are displayed in the local currency and include applicable taxes unless otherwise stated.</li>
                  <li>• We reserve the right to refuse or cancel orders at our discretion.</li>
                  <li>• Payment is required at the time of purchase unless Cash on Delivery is selected.</li>
                  <li>• For Cash on Delivery orders, payment is due upon delivery.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Shipping and Delivery</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Delivery times are estimates and may vary based on your location and product availability. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
                </p>
              </div>
            </div>
          </div>

          {/* Returns */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Returns and Refunds</h2>
                <ul className="text-muted-foreground text-sm leading-relaxed space-y-2">
                  <li>• Items may be returned within 14 days of delivery in their original condition.</li>
                  <li>• Some items may not be eligible for return due to hygiene or safety reasons.</li>
                  <li>• Refunds will be processed to the original payment method within 5-10 business days.</li>
                  <li>• Shipping costs are non-refundable unless the return is due to our error.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Limitation of Liability</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Kwixi shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid for the product or service in question.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Governing Law</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through appropriate legal channels.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Contact Us</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  If you have any questions about these Terms of Use, please contact us at{" "}
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

export default TermsOfUse;
