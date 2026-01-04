import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  User,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  Phone,
  Mail,
} from "lucide-react";
import type { Address } from "@/types/orders";
import { sampleAddresses } from "@/data/sample-addresses";
import { useToast } from "@/hooks/use-toast";

export default function MyProfile() {
  const { toast } = useToast();
  
  // Profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+961 70 123 456",
  });
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? ""
  );
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [tempAddress, setTempAddress] = useState<Partial<Address>>({});
  const [deleteAddressOpen, setDeleteAddressOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Profile handlers
  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setEditProfileOpen(false);
    toast({ title: "Profile updated", description: "Your profile has been saved." });
  };

  // Address handlers
  const handleAddAddress = () => {
    setEditingAddress(null);
    setTempAddress({ label: "", fullAddress: "", city: "", isDefault: false });
    setAddressDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setTempAddress(address);
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = () => {
    if (!tempAddress.label || !tempAddress.fullAddress || !tempAddress.city) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    if (editingAddress) {
      // Update existing
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingAddress.id) {
            return { ...a, ...tempAddress } as Address;
          }
          // If new address is default, remove default from others
          if (tempAddress.isDefault) {
            return { ...a, isDefault: false };
          }
          return a;
        })
      );
      toast({ title: "Address updated" });
    } else {
      // Add new
      const newId = `addr-${Date.now()}`;
      const newAddress: Address = {
        id: newId,
        label: tempAddress.label!,
        fullAddress: tempAddress.fullAddress!,
        city: tempAddress.city!,
        isDefault: tempAddress.isDefault ?? false,
      };
      setAddresses((prev) => {
        let updated = [...prev, newAddress];
        if (newAddress.isDefault) {
          updated = updated.map((a) =>
            a.id === newId ? a : { ...a, isDefault: false }
          );
        }
        return updated;
      });
      if (tempAddress.isDefault || addresses.length === 0) {
        setSelectedAddressId(newId);
      }
      toast({ title: "Address added" });
    }

    setAddressDialogOpen(false);
    setEditingAddress(null);
    setTempAddress({});
  };

  const handleDeleteAddress = (id: string) => {
    setAddressToDelete(id);
    setDeleteAddressOpen(true);
  };

  const confirmDeleteAddress = () => {
    if (!addressToDelete) return;
    setAddresses((prev) => prev.filter((a) => a.id !== addressToDelete));
    if (selectedAddressId === addressToDelete) {
      setSelectedAddressId(addresses.find((a) => a.id !== addressToDelete)?.id ?? "");
    }
    setDeleteAddressOpen(false);
    setAddressToDelete(null);
    toast({ title: "Address deleted" });
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    toast({ title: "Delivery location updated" });
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    setSelectedAddressId(id);
    toast({ title: "Default address updated" });
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account and addresses</p>
          </div>
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setTempProfile(profile);
                setEditProfileOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{profile.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Locations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Delivery Locations</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleAddAddress}>
              <Plus className="w-4 h-4" />
              Add Address
            </Button>
          </CardHeader>
          <CardContent>
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No addresses saved yet</p>
                <Button variant="link" onClick={handleAddAddress}>
                  Add your first address
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedAddressId} onValueChange={handleSelectAddress}>
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`relative flex items-start gap-3 p-4 rounded-xl border transition ${
                        selectedAddressId === address.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={address.id}
                          className="flex items-center gap-2 font-medium cursor-pointer"
                        >
                          {address.label}
                          {address.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{address.fullAddress}</p>
                        <p className="text-xs text-muted-foreground">{address.city}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!address.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefaultAddress(address.id);
                            }}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Set default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {selectedAddress && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Delivering to:</span>
                  <span className="font-medium">{selectedAddress.label}</span>
                  <span className="text-muted-foreground">- {selectedAddress.city}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
          <DialogContent className="rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Address Dialog */}
        <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
          <DialogContent className="rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add Address"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Label (e.g., Home, Work)</Label>
                <Input
                  value={tempAddress.label ?? ""}
                  onChange={(e) => setTempAddress({ ...tempAddress, label: e.target.value })}
                  placeholder="Home"
                />
              </div>
              <div className="space-y-2">
                <Label>Full Address</Label>
                <Input
                  value={tempAddress.fullAddress ?? ""}
                  onChange={(e) => setTempAddress({ ...tempAddress, fullAddress: e.target.value })}
                  placeholder="Street, Building, Floor"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={tempAddress.city ?? ""}
                  onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                  placeholder="Beirut"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={tempAddress.isDefault ?? false}
                  onChange={(e) => setTempAddress({ ...tempAddress, isDefault: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isDefault" className="text-sm cursor-pointer">
                  Set as default address
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddressDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAddress}>
                {editingAddress ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Address Confirmation */}
        <AlertDialog open={deleteAddressOpen} onOpenChange={setDeleteAddressOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete address?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this address from your saved locations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteAddress}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
