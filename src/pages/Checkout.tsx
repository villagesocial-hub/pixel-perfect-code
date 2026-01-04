import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, CreditCard, Truck, MapPin, Check, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocations, type Location } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Step = "shipping" | "delivery" | "payment" | "review";

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "shipping", label: "Shipping", icon: <MapPin className="w-4 h-4" /> },
  { id: "delivery", label: "Delivery", icon: <Truck className="w-4 h-4" /> },
  { id: "payment", label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
  { id: "review", label: "Review", icon: <Check className="w-4 h-4" /> },
];

const shippingMethods = [
  { id: "standard", name: "Standard Shipping", time: "5-7 business days", price: 0 },
  { id: "express", name: "Express Shipping", time: "2-3 business days", price: 9.99 },
  { id: "overnight", name: "Overnight Shipping", time: "1 business day", price: 19.99 },
];

function hasMin(value: string, n: number) {
  return value.trim().length >= n;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, promoDiscount, clearCart } = useCart();
  const { locations, selectedLocation, selectLocation, addLocation } = useLocations();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);

  // Add location dialog state
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [locationDraft, setLocationDraft] = useState<Omit<Location, "id" | "isPrimary">>({
    label: "Home",
    addressLine: "",
    city: "",
    region: "",
    country: "United States",
    notes: ""
  });
  const [locationErrors, setLocationErrors] = useState<{
    label?: string;
    addressLine?: string;
    city?: string;
    region?: string;
    country?: string;
  }>({});

  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * promoDiscount) / 100;
  const shippingCost = shippingMethods.find((m) => m.id === selectedShipping)?.price || 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    if (currentStep === "shipping" && !selectedLocation) {
      toast({
        title: "Please select a delivery location",
        description: "Choose from your saved locations or add a new one.",
        variant: "destructive",
      });
      return;
    }
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    clearCart();
    navigate(`/order-success?order=${orderNumber}`);
  };

  const openAddLocation = () => {
    setLocationDraft({
      label: "Home",
      addressLine: "",
      city: "",
      region: "",
      country: "United States",
      notes: ""
    });
    setLocationErrors({});
    setAddLocationOpen(true);
  };

  const saveNewLocation = () => {
    const errors: typeof locationErrors = {};
    if (!hasMin(locationDraft.label, 2)) errors.label = "Add a label";
    if (!hasMin(locationDraft.addressLine, 5)) errors.addressLine = "Enter an address";
    if (!hasMin(locationDraft.city, 2)) errors.city = "Enter a city";
    if (!hasMin(locationDraft.region, 2)) errors.region = "Enter a region";
    if (!hasMin(locationDraft.country, 2)) errors.country = "Enter a country";
    setLocationErrors(errors);
    if (Object.keys(errors).length) return;

    const newId = addLocation({
      label: locationDraft.label.trim(),
      addressLine: locationDraft.addressLine.trim(),
      city: locationDraft.city.trim(),
      region: locationDraft.region.trim(),
      country: locationDraft.country.trim(),
      notes: locationDraft.notes.trim(),
      isPrimary: locations.length === 0
    });
    
    selectLocation(newId);
    setAddLocationOpen(false);
    toast({
      title: "Location added",
      description: "Your new location has been saved and selected.",
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">No items to checkout</h2>
        <p className="text-muted-foreground mb-6">
          Add some items to your cart first.
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
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Back Link */}
      <Link to="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Cart
      </Link>

      {/* Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                index <= stepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {step.icon}
              <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 md:w-16 h-0.5 ${index < stepIndex ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {/* Shipping Step - Location Selection */}
          {currentStep === "shipping" && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Select Delivery Location</h2>
              
              {locations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <div className="text-base font-medium text-foreground">No saved locations</div>
                  <div className="mt-1 text-sm text-muted-foreground">Add a delivery location to continue.</div>
                  <Button className="mt-4 gap-2" onClick={openAddLocation}>
                    <Plus className="h-4 w-4" />
                    Add your first location
                  </Button>
                </div>
              ) : (
                <>
                  <RadioGroup 
                    value={selectedLocation?.id || ""} 
                    onValueChange={(id) => selectLocation(id)}
                  >
                    <div className="space-y-3">
                      {locations.map((location) => (
                        <div
                          key={location.id}
                          className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedLocation?.id === location.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => selectLocation(location.id)}
                        >
                          <RadioGroupItem value={location.id} id={location.id} className="mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={location.id} className="font-semibold cursor-pointer">
                                {location.label}
                              </Label>
                              {location.isPrimary && (
                                <Badge variant="success" className="gap-1">
                                  Primary
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {location.addressLine}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {location.city}, {location.region}, {location.country}
                            </p>
                            {location.notes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Notes: {location.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  <Button variant="outline" className="mt-4 gap-2" onClick={openAddLocation}>
                    <Plus className="h-4 w-4" />
                    Add new location
                  </Button>
                </>
              )}

              <div className="mt-6 flex justify-end">
                <Button variant="cart" onClick={handleNext} disabled={!selectedLocation}>
                  Continue to Delivery
                </Button>
              </div>
            </div>
          )}

          {/* Delivery Step */}
          {currentStep === "delivery" && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Delivery Method</h2>
              <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedShipping === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedShipping(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div>
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{method.time}</p>
                        </div>
                      </div>
                      <span className="font-bold">
                        {method.price === 0 ? "FREE" : `$${method.price.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="cart" onClick={handleNext}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input
                    id="nameOnCard"
                    value={paymentInfo.nameOnCard}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={paymentInfo.expiry}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="cart" onClick={handleNext}>
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === "review" && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Review Your Order</h2>
              
              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping To</h3>
                {selectedLocation && (
                  <div className="text-foreground">
                    <p className="font-semibold">{selectedLocation.label}</p>
                    <p>{selectedLocation.addressLine}</p>
                    <p>{selectedLocation.city}, {selectedLocation.region}</p>
                    <p>{selectedLocation.country}</p>
                    {selectedLocation.notes && (
                      <p className="text-sm text-muted-foreground mt-1">Notes: {selectedLocation.notes}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Method */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Delivery Method</h3>
                <p className="text-foreground">
                  {shippingMethods.find((m) => m.id === selectedShipping)?.name}
                </p>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary/30 rounded overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="cart" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-4 sticky top-20">
            <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
            
            {/* Items Preview */}
            <div className="space-y-3 mb-4">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-secondary/30 rounded overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-sm text-muted-foreground">+{items.length - 3} more items</p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-save">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Location Dialog */}
      <Dialog open={addLocationOpen} onOpenChange={setAddLocationOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add delivery location</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="loc-label">Label</Label>
              <Input 
                id="loc-label" 
                value={locationDraft.label} 
                onChange={e => setLocationDraft(d => ({ ...d, label: e.target.value }))} 
                aria-invalid={Boolean(locationErrors.label)} 
                placeholder="Home, Work, etc." 
                className="mt-1.5" 
              />
              {locationErrors.label && <p className="mt-1 text-xs text-destructive">{locationErrors.label}</p>}
            </div>

            <div>
              <Label htmlFor="loc-country">Country</Label>
              <Input 
                id="loc-country" 
                value={locationDraft.country} 
                onChange={e => setLocationDraft(d => ({ ...d, country: e.target.value }))} 
                aria-invalid={Boolean(locationErrors.country)} 
                className="mt-1.5" 
              />
              {locationErrors.country && <p className="mt-1 text-xs text-destructive">{locationErrors.country}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="loc-address">Address</Label>
              <Input 
                id="loc-address" 
                value={locationDraft.addressLine} 
                onChange={e => setLocationDraft(d => ({ ...d, addressLine: e.target.value }))} 
                placeholder="Street, building, apartment" 
                aria-invalid={Boolean(locationErrors.addressLine)} 
                className="mt-1.5" 
              />
              {locationErrors.addressLine && <p className="mt-1 text-xs text-destructive">{locationErrors.addressLine}</p>}
            </div>

            <div>
              <Label htmlFor="loc-city">City</Label>
              <Input 
                id="loc-city" 
                value={locationDraft.city} 
                onChange={e => setLocationDraft(d => ({ ...d, city: e.target.value }))} 
                aria-invalid={Boolean(locationErrors.city)} 
                className="mt-1.5" 
              />
              {locationErrors.city && <p className="mt-1 text-xs text-destructive">{locationErrors.city}</p>}
            </div>

            <div>
              <Label htmlFor="loc-region">Region</Label>
              <Input 
                id="loc-region" 
                value={locationDraft.region} 
                onChange={e => setLocationDraft(d => ({ ...d, region: e.target.value }))} 
                aria-invalid={Boolean(locationErrors.region)} 
                className="mt-1.5" 
              />
              {locationErrors.region && <p className="mt-1 text-xs text-destructive">{locationErrors.region}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="loc-notes">Delivery notes</Label>
              <Textarea 
                id="loc-notes" 
                value={locationDraft.notes} 
                onChange={e => setLocationDraft(d => ({ ...d, notes: e.target.value }))} 
                placeholder="Optional" 
                className="mt-1.5" 
              />
              <p className="mt-1 text-xs text-muted-foreground">Driver instructions only.</p>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setAddLocationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNewLocation}>
              Save Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
