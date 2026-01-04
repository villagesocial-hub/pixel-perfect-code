import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, Pencil, Plus, Trash2, Star, Upload, Image as ImageIcon, Mail, Phone, ShieldCheck } from "lucide-react";
import { useLocations, type Location } from "@/contexts/LocationContext";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type LanguageCode = "en" | "ar" | "fr";

type Profile = {
  imageDataUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  joiningDate: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | "";
  dateOfBirth: string;
  languageCode: LanguageCode;
};

function formatJoinDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function initials(firstName: string, lastName: string) {
  const a = (firstName || "").trim().slice(0, 1);
  const b = (lastName || "").trim().slice(0, 1);
  return (a + b).toUpperCase() || "U";
}

function sanitizePhone(value: string) {
  return value.replace(/[^0-9+\s]/g, "");
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasMin(value: string, n: number) {
  return value.trim().length >= n;
}

const languageOptions: Array<{
  code: LanguageCode;
  label: string;
}> = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" }
];

const PROFILE_STORAGE_KEY = "user-profile";

const defaultProfile: Profile = {
  imageDataUrl: "",
  firstName: "Antoun",
  lastName: "El Morr",
  email: "antoun@example.com",
  emailVerified: true,
  phone: "+961 70 123 456",
  phoneVerified: false,
  joiningDate: "2025-07-14T12:00:00.000Z",
  gender: "",
  dateOfBirth: "",
  languageCode: "en"
};

function loadProfile(): Profile {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      return { ...defaultProfile, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parsing errors
  }
  return defaultProfile;
}

function saveProfileToStorage(profile: Profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage errors
  }
}

export default function MyProfile() {
  const { locations, primaryLocation, addLocation, updateLocation, removeLocation, setPrimary } = useLocations();

  const [profile, setProfile] = useState<Profile>(loadProfile);

  const [identityEditing, setIdentityEditing] = useState(false);
  const [prefsEditing, setPrefsEditing] = useState(false);

  const [identityDraft, setIdentityDraft] = useState(() => ({
    imageDataUrl: profile.imageDataUrl,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone
  }));

  const [prefsDraft, setPrefsDraft] = useState(() => ({
    gender: profile.gender,
    dateOfBirth: profile.dateOfBirth,
    languageCode: profile.languageCode
  }));

  const [identityErrors, setIdentityErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }>({});

  const [prefsErrors, setPrefsErrors] = useState<{
    dateOfBirth?: string;
  }>({});

  const [toast, setToast] = useState<{
    title: string;
    message?: string;
  } | null>(null);

  const [savingSection, setSavingSection] = useState<"identity" | "prefs" | "location" | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Verification state
  const [verificationDialog, setVerificationDialog] = useState<{
    open: boolean;
    type: "email" | "phone";
    value: string;
    code: string;
  }>({ open: false, type: "email", value: "", code: "" });
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // Fixed verification code for demo
  const DEMO_CODE = "123456";

  const handleSendVerificationCode = async (type: "email" | "phone") => {
    const value = type === "email" ? profile.email : profile.phone;
    setSendingCode(true);
    
    // Simulate sending code
    await new Promise(r => setTimeout(r, 1000));
    
    setVerificationDialog({ open: true, type, value, code: DEMO_CODE });
    setOtpValue("");
    setOtpError("");
    setCodeSent(true);
    setSendingCode(false);
    
    showToast("Code Sent", "Enter code: 123456");
  };

  const handleVerifyCode = async () => {
    if (otpValue.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }
    
    setVerifying(true);
    await new Promise(r => setTimeout(r, 800));
    
    if (otpValue === verificationDialog.code) {
      // Verification successful
      if (verificationDialog.type === "email") {
        setProfile(p => ({ ...p, emailVerified: true }));
      } else {
        setProfile(p => ({ ...p, phoneVerified: true }));
      }
      setVerificationDialog(v => ({ ...v, open: false }));
      setCodeSent(false);
      showToast("Verified", `Your ${verificationDialog.type} has been verified.`);
    } else {
      setOtpError("Invalid code. Please try again.");
    }
    setVerifying(false);
  };

  const handleResendCode = async () => {
    setSendingCode(true);
    await new Promise(r => setTimeout(r, 1000));
    
    setVerificationDialog(v => ({ ...v, code: DEMO_CODE }));
    setOtpValue("");
    setOtpError("");
    setSendingCode(false);
    showToast("Code Resent", "Enter code: 123456");
  };

  const profileCompletion = useMemo(() => {
    const checks = [
      hasMin(profile.firstName, 2),
      hasMin(profile.lastName, 2),
      isEmail(profile.email),
      hasMin(profile.phone, 6),
      locations.length > 0,
      locations.some(l => l.isPrimary)
    ];
    const ok = checks.filter(Boolean).length;
    return Math.round(ok / checks.length * 100);
  }, [profile.firstName, profile.lastName, profile.email, profile.phone, locations]);

  // Persist profile changes to localStorage
  useEffect(() => {
    saveProfileToStorage(profile);
  }, [profile]);

  function showToast(title: string, message?: string) {
    setToast({ title, message });
    window.setTimeout(() => setToast(null), 2500);
  }

  function startIdentityEdit() {
    setIdentityDraft({
      imageDataUrl: profile.imageDataUrl,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone
    });
    setIdentityErrors({});
    setIdentityEditing(true);
  }

  function cancelIdentityEdit() {
    setIdentityEditing(false);
    setIdentityErrors({});
  }

  async function saveIdentity() {
    const errors: typeof identityErrors = {};
    if (!hasMin(identityDraft.firstName, 2)) errors.firstName = "Enter your first name";
    if (!hasMin(identityDraft.lastName, 2)) errors.lastName = "Enter your last name";
    if (!isEmail(identityDraft.email)) errors.email = "Enter a valid email";
    if (!hasMin(identityDraft.phone, 6)) errors.phone = "Enter a valid phone number";
    setIdentityErrors(errors);
    if (Object.keys(errors).length) return;

    const emailChanged = identityDraft.email.trim() !== profile.email;
    const phoneChanged = identityDraft.phone.trim() !== profile.phone;

    setSavingSection("identity");
    await new Promise(r => setTimeout(r, 650));

    setProfile(p => ({
      ...p,
      imageDataUrl: identityDraft.imageDataUrl,
      firstName: identityDraft.firstName.trim(),
      lastName: identityDraft.lastName.trim(),
      email: identityDraft.email.trim(),
      phone: identityDraft.phone.trim(),
      emailVerified: emailChanged ? false : p.emailVerified,
      phoneVerified: phoneChanged ? false : p.phoneVerified
    }));

    setSavingSection(null);
    setIdentityEditing(false);

    if (emailChanged || phoneChanged) {
      showToast("Saved", "Email or phone changed. Verification is required.");
      return;
    }
    showToast("Saved", "Your identity details are updated.");
  }

  function startPrefsEdit() {
    setPrefsDraft({
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      languageCode: profile.languageCode
    });
    setPrefsErrors({});
    setPrefsEditing(true);
  }

  function cancelPrefsEdit() {
    setPrefsEditing(false);
    setPrefsErrors({});
  }

  async function savePrefs() {
    const errors: typeof prefsErrors = {};
    if (prefsDraft.dateOfBirth) {
      const d = new Date(prefsDraft.dateOfBirth);
      if (Number.isNaN(d.getTime())) errors.dateOfBirth = "Pick a valid date";
    }
    setPrefsErrors(errors);
    if (Object.keys(errors).length) return;

    setSavingSection("prefs");
    await new Promise(r => setTimeout(r, 550));

    setProfile(p => ({
      ...p,
      gender: prefsDraft.gender,
      dateOfBirth: prefsDraft.dateOfBirth,
      languageCode: prefsDraft.languageCode
    }));

    setSavingSection(null);
    setPrefsEditing(false);
    showToast("Saved", "Preferences updated.");
  }

  async function handleSetPrimary(id: string) {
    setSavingSection("location");
    await new Promise(r => setTimeout(r, 450));
    setPrimary(id);
    setSavingSection(null);
    showToast("Updated", "Primary location set.");
  }

  async function handleRemoveLocation(id: string) {
    setSavingSection("location");
    await new Promise(r => setTimeout(r, 450));
    removeLocation(id);
    setSavingSection(null);
    showToast("Removed", "Location removed.");
  }

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
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

  function openAddLocation() {
    setEditingLocationId(null);
    setLocationDraft({
      label: "Home",
      addressLine: "",
      city: "",
      region: "",
      country: "Lebanon",
      notes: ""
    });
    setLocationErrors({});
    setLocationDialogOpen(true);
  }

  function openEditLocation(l: Location) {
    setEditingLocationId(l.id);
    setLocationDraft({
      label: l.label,
      addressLine: l.addressLine,
      city: l.city,
      region: l.region,
      country: l.country,
      notes: l.notes
    });
    setLocationErrors({});
    setLocationDialogOpen(true);
  }

  async function saveLocation() {
    const errors: typeof locationErrors = {};
    if (!hasMin(locationDraft.label, 2)) errors.label = "Add a label";
    if (!hasMin(locationDraft.addressLine, 5)) errors.addressLine = "Enter an address";
    if (!hasMin(locationDraft.city, 2)) errors.city = "Enter a city";
    if (!hasMin(locationDraft.region, 2)) errors.region = "Enter a region";
    if (!hasMin(locationDraft.country, 2)) errors.country = "Enter a country";
    setLocationErrors(errors);
    if (Object.keys(errors).length) return;

    setSavingSection("location");
    await new Promise(r => setTimeout(r, 600));

    if (editingLocationId) {
      updateLocation(editingLocationId, {
        label: locationDraft.label.trim(),
        addressLine: locationDraft.addressLine.trim(),
        city: locationDraft.city.trim(),
        region: locationDraft.region.trim(),
        country: locationDraft.country.trim(),
        notes: locationDraft.notes.trim()
      });
      setSavingSection(null);
      setLocationDialogOpen(false);
      showToast("Saved", "Location updated.");
      return;
    }

    const isFirst = locations.length === 0;
    addLocation({
      label: locationDraft.label.trim(),
      addressLine: locationDraft.addressLine.trim(),
      city: locationDraft.city.trim(),
      region: locationDraft.region.trim(),
      country: locationDraft.country.trim(),
      notes: locationDraft.notes.trim(),
      isPrimary: isFirst
    });

    setSavingSection(null);
    setLocationDialogOpen(false);
    showToast("Saved", isFirst ? "Location saved as primary." : "Location added.");
  }

  async function onPickProfileImage(file: File | null) {
    if (!file) return;
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      showToast("Image too large", "Please choose an image under 5MB.");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      showToast("Unsupported format", "Use JPG, PNG, or WEBP.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setIdentityDraft(d => ({ ...d, imageDataUrl: result }));
      showToast("Selected", "Save to apply the new photo.");
    };
    reader.readAsDataURL(file);
  }

  const needsAttention = useMemo(() => {
    const missingPhone = !hasMin(profile.phone, 6);
    const missingPrimary = !primaryLocation;
    return missingPhone || missingPrimary;
  }, [profile.phone, primaryLocation]);

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your identity, preferences, and saved locations.</p>
          </div>
        </div>

        {/* Toast */}
        {toast ? (
          <div className="mb-6 animate-fade-in rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full border border-foreground/20 bg-foreground/10 p-1">
                <Check className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{toast.title}</div>
                {toast.message ? <div className="text-sm text-muted-foreground">{toast.message}</div> : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4">
          {/* Identity Card */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-foreground">Identity</CardTitle>
                <CardDescription>Who you are and how we reach you.</CardDescription>
              </div>

              {!identityEditing ? (
                <Button variant="outline" size="sm" onClick={startIdentityEdit} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={cancelIdentityEdit} disabled={savingSection === "identity"}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveIdentity} disabled={savingSection === "identity"}>
                    {savingSection === "identity" ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-border">
                      <AvatarImage src={identityEditing ? identityDraft.imageDataUrl || undefined : profile.imageDataUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {initials(profile.firstName, profile.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="text-lg font-semibold leading-tight truncate text-foreground">{fullName || "Your name"}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant={profile.emailVerified ? "outline" : "secondary"}>
                          Email {profile.emailVerified ? "verified" : "not verified"}
                        </Badge>
                        <Badge variant={profile.phoneVerified ? "outline" : "secondary"}>
                          Phone {profile.phoneVerified ? "verified" : "not verified"}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Joined {formatJoinDate(profile.joiningDate)} · Joining date is not editable.
                      </div>
                    </div>
                  </div>

                  {identityEditing ? (
                    <div className="flex flex-col gap-2 sm:items-end">
                      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => onPickProfileImage(e.target.files?.[0] ?? null)} />
                      <Button type="button" variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4" />
                        Change photo
                      </Button>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP up to 5MB.</p>
                    </div>
                  ) : null}
                </div>

                <Separator />

                {!identityEditing ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-sm text-muted-foreground">First name</div>
                      <div className="font-medium text-foreground">{profile.firstName}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Last name</div>
                      <div className="font-medium text-foreground">{profile.lastName}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium text-foreground">{profile.email}</span>
                        {profile.emailVerified ? (
                          <Badge variant="success" className="gap-1 text-xs">
                            <Check className="h-3 w-3" /> Verified
                          </Badge>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs gap-1"
                            onClick={() => handleSendVerificationCode("email")}
                            disabled={sendingCode}
                          >
                            <ShieldCheck className="h-3 w-3" />
                            {sendingCode ? "Sending..." : "Verify"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium text-foreground">{profile.phone}</span>
                        {profile.phoneVerified ? (
                          <Badge variant="success" className="gap-1 text-xs">
                            <Check className="h-3 w-3" /> Verified
                          </Badge>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs gap-1"
                            onClick={() => handleSendVerificationCode("phone")}
                            disabled={sendingCode}
                          >
                            <ShieldCheck className="h-3 w-3" />
                            {sendingCode ? "Sending..." : "Verify"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="text-sm text-muted-foreground">Primary location</div>
                      <div className="font-medium text-foreground">
                        {primaryLocation ? `${primaryLocation.label}, ${primaryLocation.city}` : "Not set"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" value={identityDraft.firstName} onChange={e => setIdentityDraft(d => ({
                        ...d,
                        firstName: e.target.value
                      }))} aria-invalid={Boolean(identityErrors.firstName)} autoComplete="given-name" className="mt-1.5" />
                      {identityErrors.firstName ? <p className="mt-1 text-xs text-destructive">{identityErrors.firstName}</p> : null}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" value={identityDraft.lastName} onChange={e => setIdentityDraft(d => ({
                        ...d,
                        lastName: e.target.value
                      }))} aria-invalid={Boolean(identityErrors.lastName)} autoComplete="family-name" className="mt-1.5" />
                      {identityErrors.lastName ? <p className="mt-1 text-xs text-destructive">{identityErrors.lastName}</p> : null}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      {profile.emailVerified ? (
                        <div className="mt-1.5">
                          <div className="flex items-center gap-2 p-2.5 bg-muted/50 border border-border rounded-md">
                            <span className="text-sm text-muted-foreground flex-1">{profile.email}</span>
                            <Badge variant="success" className="gap-1 text-xs">
                              <Check className="h-3 w-3" /> Verified
                            </Badge>
                          </div>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            To change your verified email, enter a new one below:
                          </p>
                          <Input 
                            id="email" 
                            value={identityDraft.email === profile.email ? "" : identityDraft.email} 
                            onChange={e => setIdentityDraft(d => ({
                              ...d,
                              email: e.target.value || profile.email
                            }))} 
                            placeholder="Enter new email"
                            aria-invalid={Boolean(identityErrors.email)} 
                            autoComplete="email" 
                            className="mt-1.5" 
                          />
                          {identityErrors.email ? <p className="mt-1 text-xs text-destructive">{identityErrors.email}</p> : null}
                          {identityDraft.email !== profile.email && identityDraft.email && (
                            <p className="mt-1 text-xs text-amber-600">New email will require verification after saving.</p>
                          )}
                        </div>
                      ) : (
                        <>
                          <Input id="email" value={identityDraft.email} onChange={e => setIdentityDraft(d => ({
                            ...d,
                            email: e.target.value
                          }))} aria-invalid={Boolean(identityErrors.email)} autoComplete="email" className="mt-1.5" />
                          {identityErrors.email ? <p className="mt-1 text-xs text-destructive">{identityErrors.email}</p> : null}
                          <p className="mt-1 text-xs text-muted-foreground">Email requires verification.</p>
                        </>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      {profile.phoneVerified ? (
                        <div className="mt-1.5">
                          <div className="flex items-center gap-2 p-2.5 bg-muted/50 border border-border rounded-md">
                            <span className="text-sm text-muted-foreground flex-1">{profile.phone}</span>
                            <Badge variant="success" className="gap-1 text-xs">
                              <Check className="h-3 w-3" /> Verified
                            </Badge>
                          </div>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            To change your verified phone, enter a new one below:
                          </p>
                          <Input 
                            id="phone" 
                            value={identityDraft.phone === profile.phone ? "" : identityDraft.phone} 
                            onChange={e => setIdentityDraft(d => ({
                              ...d,
                              phone: sanitizePhone(e.target.value) || profile.phone
                            }))} 
                            placeholder="Enter new phone"
                            aria-invalid={Boolean(identityErrors.phone)} 
                            autoComplete="tel" 
                            className="mt-1.5" 
                          />
                          {identityErrors.phone ? <p className="mt-1 text-xs text-destructive">{identityErrors.phone}</p> : null}
                          {identityDraft.phone !== profile.phone && identityDraft.phone && (
                            <p className="mt-1 text-xs text-amber-600">New phone will require verification after saving.</p>
                          )}
                        </div>
                      ) : (
                        <>
                          <Input id="phone" value={identityDraft.phone} onChange={e => setIdentityDraft(d => ({
                            ...d,
                            phone: sanitizePhone(e.target.value)
                          }))} aria-invalid={Boolean(identityErrors.phone)} autoComplete="tel" className="mt-1.5" />
                          {identityErrors.phone ? <p className="mt-1 text-xs text-destructive">{identityErrors.phone}</p> : null}
                          <p className="mt-1 text-xs text-muted-foreground">Phone requires verification.</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-foreground">Preferences</CardTitle>
                <CardDescription>Optional details to personalize your experience.</CardDescription>
              </div>

              {!prefsEditing ? (
                <Button variant="outline" size="sm" onClick={startPrefsEdit} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={cancelPrefsEdit} disabled={savingSection === "prefs"}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={savePrefs} disabled={savingSection === "prefs"}>
                    {savingSection === "prefs" ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {!prefsEditing ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Gender</div>
                    <div className="font-medium text-foreground capitalize">{profile.gender ? profile.gender.replace(/_/g, " ") : "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date of birth</div>
                    <div className="font-medium text-foreground">{profile.dateOfBirth || "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Language</div>
                    <div className="font-medium text-foreground">{languageOptions.find(l => l.code === profile.languageCode)?.label ?? profile.languageCode}</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label>Gender</Label>
                    <Select value={prefsDraft.gender || ""} onValueChange={v => setPrefsDraft(d => ({
                      ...d,
                      gender: v as Profile["gender"]
                    }))}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dob">Date of birth</Label>
                    <Input id="dob" type="date" value={prefsDraft.dateOfBirth} max={new Date().toISOString().split('T')[0]} onChange={e => setPrefsDraft(d => ({
                      ...d,
                      dateOfBirth: e.target.value
                    }))} aria-invalid={Boolean(prefsErrors.dateOfBirth)} className="mt-1.5" />
                    {prefsErrors.dateOfBirth ? <p className="mt-1 text-xs text-destructive">{prefsErrors.dateOfBirth}</p> : null}
                  </div>

                  <div>
                    <Label>Language</Label>
                    <Select value={prefsDraft.languageCode} onValueChange={v => setPrefsDraft(d => ({
                      ...d,
                      languageCode: v as LanguageCode
                    }))}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(l => (
                          <SelectItem key={l.code} value={l.code}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-muted-foreground">Updates after save.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Locations Card */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-foreground">Locations</CardTitle>
                <CardDescription>Add multiple delivery locations and set one as primary.</CardDescription>
              </div>

              <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddLocation} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add location
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingLocationId ? "Edit location" : "Add location"}</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input id="label" value={locationDraft.label} onChange={e => setLocationDraft(d => ({
                        ...d,
                        label: e.target.value
                      }))} aria-invalid={Boolean(locationErrors.label)} placeholder="Home, Work, Mom's house" className="mt-1.5" />
                      {locationErrors.label ? <p className="mt-1 text-xs text-destructive">{locationErrors.label}</p> : null}
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value={locationDraft.country} onChange={e => setLocationDraft(d => ({
                        ...d,
                        country: e.target.value
                      }))} aria-invalid={Boolean(locationErrors.country)} className="mt-1.5" />
                      {locationErrors.country ? <p className="mt-1 text-xs text-destructive">{locationErrors.country}</p> : null}
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={locationDraft.addressLine} onChange={e => setLocationDraft(d => ({
                        ...d,
                        addressLine: e.target.value
                      }))} placeholder="Street, building, apartment" aria-invalid={Boolean(locationErrors.addressLine)} className="mt-1.5" />
                      {locationErrors.addressLine ? <p className="mt-1 text-xs text-destructive">{locationErrors.addressLine}</p> : null}
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={locationDraft.city} onChange={e => setLocationDraft(d => ({
                        ...d,
                        city: e.target.value
                      }))} aria-invalid={Boolean(locationErrors.city)} className="mt-1.5" />
                      {locationErrors.city ? <p className="mt-1 text-xs text-destructive">{locationErrors.city}</p> : null}
                    </div>

                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Input id="region" value={locationDraft.region} onChange={e => setLocationDraft(d => ({
                        ...d,
                        region: e.target.value
                      }))} aria-invalid={Boolean(locationErrors.region)} className="mt-1.5" />
                      {locationErrors.region ? <p className="mt-1 text-xs text-destructive">{locationErrors.region}</p> : null}
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="notes">Delivery notes</Label>
                      <Textarea id="notes" value={locationDraft.notes} onChange={e => setLocationDraft(d => ({
                        ...d,
                        notes: e.target.value
                      }))} placeholder="Optional" className="mt-1.5" />
                      <p className="mt-1 text-xs text-muted-foreground">Keep it short. Driver instructions only.</p>
                    </div>
                  </div>

                  <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => setLocationDialogOpen(false)} disabled={savingSection === "location"}>
                      Cancel
                    </Button>
                    <Button onClick={saveLocation} disabled={savingSection === "location"}>
                      {savingSection === "location" ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              {locations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6">
                  <div className="text-base font-medium text-foreground">No saved locations</div>
                  <div className="mt-1 text-sm text-muted-foreground">Add a location for faster checkout and accurate delivery.</div>
                  <Button className="mt-4 gap-2" onClick={openAddLocation}>
                    <Plus className="h-4 w-4" />
                    Add your first location
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {locations.map(l => (
                    <div key={l.id} className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-base font-semibold text-foreground">{l.label}</div>
                            {l.isPrimary ? (
                              <Badge className="gap-1" variant="success">
                                <Star className="h-3.5 w-3.5" />
                                Primary
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Saved</Badge>
                            )}
                          </div>

                          <div className="mt-2 text-sm">
                            <div className="text-muted-foreground">{l.addressLine}</div>
                            <div className="text-muted-foreground">{l.city}, {l.region}, {l.country}</div>
                            {l.notes ? <div className="mt-1 text-xs text-muted-foreground">Notes: {l.notes}</div> : null}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="gap-2" onClick={() => openEditLocation(l)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          {!l.isPrimary ? (
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleSetPrimary(l.id)} disabled={savingSection === "location"}>
                              <Star className="h-4 w-4" />
                              Set primary
                            </Button>
                          ) : null}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive" disabled={savingSection === "location"}>
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove this location</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the saved location from your account. You can add it again anytime.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveLocation(l.id)}>Remove</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="text-xs text-muted-foreground">Tip: Keep one primary location for the fastest checkout experience.</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={verificationDialog.open} onOpenChange={(open) => {
        if (!open) {
          setVerificationDialog(v => ({ ...v, open: false }));
          setCodeSent(false);
          setOtpValue("");
          setOtpError("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-foreground/10">
                {verificationDialog.type === "email" ? (
                  <Mail className="h-5 w-5 text-foreground" />
                ) : (
                  <Phone className="h-5 w-5 text-foreground" />
                )}
              </div>
              <DialogTitle>Verify your {verificationDialog.type}</DialogTitle>
            </div>
            <DialogDescription>
              We sent a 6-digit verification code to{" "}
              <span className="font-medium text-foreground">{verificationDialog.value}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => {
                  setOtpValue(value);
                  setOtpError("");
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {otpError && (
                <p className="text-sm text-destructive">{otpError}</p>
              )}

              <Button
                variant="link"
                size="sm"
                className="text-muted-foreground"
                onClick={handleResendCode}
                disabled={sendingCode}
              >
                {sendingCode ? "Sending..." : "Resend code"}
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setVerificationDialog(v => ({ ...v, open: false }));
                setCodeSent(false);
                setOtpValue("");
                setOtpError("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleVerifyCode} disabled={verifying || otpValue.length !== 6}>
              {verifying ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
