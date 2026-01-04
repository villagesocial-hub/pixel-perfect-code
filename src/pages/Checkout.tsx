import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, MapPin, Plus, Banknote, Store } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocations, type Location } from "@/contexts/LocationContext";
import { useOrders } from "@/contexts/OrdersContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useProfileValidation } from "@/hooks/useProfileValidation";
import { ProfileValidationDialog } from "@/components/ProfileValidationDialog";

function hasMin(value: string, n: number) {
  return value.trim().length >= n;
}

function generateOrderNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "KMX ";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, promoDiscount, clearCart } = useCart();
  const { locations, selectedLocation, selectLocation, addLocation } = useLocations();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const { isValid: isProfileValid, missingFields } = useProfileValidation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProfileValidation, setShowProfileValidation] = useState(false);

  // Add location dialog state
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [locationDraft, setLocationDraft] = useState<Omit<Location, "id" | "isPrimary">>({
    label: "Home",
    addressLine: "",
    city: "",
    region: "",
    country: "Lebanon",
    notes: ""
  });
  const [locationErrors, setLocationErrors] = useState<{
    label?: string;
    addressLine?: string;
    city?: string;
    region?: string;
    country?: string;
  }>({});

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * promoDiscount) / 100;
  const shippingCost = 0; // Free shipping
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const handlePlaceOrder = async () => {
    // First check if profile has required info
    if (!isProfileValid) {
      setShowProfileValidation(true);
      return;
    }

    if (!selectedLocation) {
      toast({
        title: "Please select a delivery location",
        description: "Choose from your saved locations or add a new one.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const orderNumber = generateOrderNumber();
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    
    // Create order from cart items
    addOrder({
      number: orderNumber,
      date: dateStr,
      total: total,
      status: "Pending",
      paymentMethod: "Cash on delivery",
      address: `${selectedLocation.city}, ${selectedLocation.region}, ${selectedLocation.addressLine}`,
      items: items.map((item, index) => ({
        id: `item-${index}-${Date.now()}`,
        name: item.title,
        variant: item.options?.map(o => o.value).join(", ") || "Standard",
        qty: item.quantity,
        price: item.price,
        imageUrl: item.image,
        productUrl: `/product/${item.id}`,
      })),
    });
    
    clearCart();
    navigate(`/order-success?order=${orderNumber}`);
  };

  const openAddLocation = () => {
    setLocationDraft({
      label: "Home",
      addressLine: "",
      city: "",
      region: "",
      country: "Lebanon",
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back Link */}
      <Link to="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-semibold text-foreground mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Location Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Location
            </h2>
            
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
          </div>

          {/* Payment Method Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Payment Method
            </h2>
            
            <div className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Banknote className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
              </div>
            </div>
          </div>

          {/* Order Items Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Items ({items.length})</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-3 bg-secondary/10 rounded-lg border border-border">
                  {/* Image - matching ProductCard style */}
                  <div className="w-20 h-20 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-normal text-foreground line-clamp-2 leading-tight mb-1">{item.title}</p>
                    {item.seller && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 bg-secondary px-2 py-1 rounded w-fit">
                        <Store className="w-3 h-3" />
                        <span>{item.seller}</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-bold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-xs text-muted-foreground line-through">
                        ${(item.originalPrice * item.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
            <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
            
            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
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
                <span className="text-save">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button 
              variant="cart" 
              className="w-full mt-6" 
              size="lg"
              onClick={handlePlaceOrder} 
              disabled={isProcessing || !selectedLocation}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>

            {!selectedLocation && locations.length > 0 && (
              <p className="text-xs text-destructive text-center mt-2">
                Please select a delivery location
              </p>
            )}

            <p className="text-xs text-muted-foreground text-center mt-3">
              By placing your order, you agree to our terms and conditions.
            </p>
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

      {/* Profile Validation Dialog */}
      <ProfileValidationDialog
        open={showProfileValidation}
        onOpenChange={setShowProfileValidation}
        missingFields={missingFields}
      />
    </div>
  );
};

export default Checkout;
