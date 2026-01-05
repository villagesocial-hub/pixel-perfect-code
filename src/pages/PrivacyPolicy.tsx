import { Link } from "react-router-dom";
import { Shield, Eye, Lock, Database, UserCheck, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 5, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Introduction */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Your Privacy Matters</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  At Kwixi, we are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and safeguard your data when you use our services.
                </p>
              </div>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Information We Collect</h2>
                <ul className="text-muted-foreground text-sm leading-relaxed space-y-2">
                  <li>• <strong>Account Information:</strong> Name, email address, phone number, and shipping address when you create an account or place an order.</li>
                  <li>• <strong>Payment Information:</strong> Payment details are processed securely through our payment partners. We do not store full credit card numbers.</li>
                  <li>• <strong>Usage Data:</strong> Information about how you interact with our website, including pages visited and products viewed.</li>
                  <li>• <strong>Device Information:</strong> Browser type, device type, and IP address for security and optimization purposes.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">How We Use Your Information</h2>
                <ul className="text-muted-foreground text-sm leading-relaxed space-y-2">
                  <li>• Process and fulfill your orders</li>
                  <li>• Send order confirmations and shipping updates</li>
                  <li>• Provide customer support</li>
                  <li>• Improve our products and services</li>
                  <li>• Send promotional communications (with your consent)</li>
                  <li>• Prevent fraud and ensure security</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Data Security</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We implement industry-standard security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Your Rights</h2>
                <ul className="text-muted-foreground text-sm leading-relaxed space-y-2">
                  <li>• <strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                  <li>• <strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                  <li>• <strong>Deletion:</strong> Request deletion of your personal data, subject to legal requirements.</li>
                  <li>• <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
                </ul>
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
                  If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at{" "}
                  <a href="mailto:privacy@kwixi.com" className="text-foreground underline">privacy@kwixi.com</a>.
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

export default PrivacyPolicy;
