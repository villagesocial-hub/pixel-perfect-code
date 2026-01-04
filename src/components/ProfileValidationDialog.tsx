import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Phone, Mail, User, Calendar, Users, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { CountryCodeSelect, countryCodes } from "@/components/CountryCodeSelect";

type MissingField = "location" | "contact" | "phone" | "email" | "firstName" | "lastName" | "gender" | "dateOfBirth";

interface ProfileValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingFields: MissingField[];
  onComplete?: () => void;
}

const PROFILE_STORAGE_KEY = "user-profile";
const DEMO_CODE = "123456";

interface StoredProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  gender?: string;
  dateOfBirth?: string;
}

function getStoredProfile(): StoredProfile {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore
  }
  return {};
}

function saveProfile(updates: Partial<StoredProfile>) {
  try {
    const current = getStoredProfile();
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ ...current, ...updates }));
  } catch {
    // Ignore
  }
}

function getCountryCodeFromPhone(phone: string): string {
  const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
  for (const c of sortedCodes) {
    if (phone.startsWith(c.code)) return c.code;
  }
  return "+961";
}

function getPhoneWithoutCode(phone: string): string {
  const code = getCountryCodeFromPhone(phone);
  return phone.startsWith(code) ? phone.slice(code.length).trim() : phone;
}

function sanitizePhoneNumber(value: string) {
  return value.replace(/[^0-9\s]/g, "");
}

// Generate years from 1920 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function getDaysInMonth(month: string, year: string): number {
  if (!month || !year) return 31;
  return new Date(parseInt(year), parseInt(month), 0).getDate();
}

export function ProfileValidationDialog({ open, onOpenChange, missingFields, onComplete }: ProfileValidationDialogProps) {
  const [completedFields, setCompletedFields] = useState<Set<MissingField>>(new Set());
  const [saving, setSaving] = useState(false);

  // Phone state
  const [phoneCountryCode, setPhoneCountryCode] = useState("+961");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneVerificationStep, setPhoneVerificationStep] = useState<"input" | "otp" | "verified">("input");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Gender state
  const [gender, setGender] = useState("");

  // Date of birth state
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCompletedFields(new Set());
      setPhoneVerificationStep("input");
      setOtpValue("");
      setOtpError("");
      setPhoneNumber("");
      setGender("");
      setDobMonth("");
      setDobDay("");
      setDobYear("");
    }
  }, [open]);

  const handleSendPhoneCode = async () => {
    if (phoneNumber.length < 6) return;
    
    setSendingCode(true);
    await new Promise(r => setTimeout(r, 1000));
    setSendingCode(false);
    setPhoneVerificationStep("otp");
    setResendCountdown(60);
  };

  const handleVerifyPhone = async () => {
    if (otpValue.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    setVerifying(true);
    await new Promise(r => setTimeout(r, 800));

    if (otpValue === DEMO_CODE) {
      const fullPhone = `${phoneCountryCode} ${phoneNumber}`.trim();
      saveProfile({ phone: fullPhone, phoneVerified: true });
      setPhoneVerificationStep("verified");
      setCompletedFields(prev => new Set([...prev, "phone"]));
      setVerifying(false);
    } else {
      setOtpError("Invalid code. Try: 123456");
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setSendingCode(true);
    await new Promise(r => setTimeout(r, 1000));
    setSendingCode(false);
    setOtpValue("");
    setOtpError("");
    setResendCountdown(60);
  };

  const handleSaveGender = async () => {
    if (!gender) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    saveProfile({ gender });
    setCompletedFields(prev => new Set([...prev, "gender"]));
    setSaving(false);
  };

  const handleSaveDob = async () => {
    if (!dobMonth || !dobDay || !dobYear) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay.padStart(2, "0")}`;
    saveProfile({ dateOfBirth });
    setCompletedFields(prev => new Set([...prev, "dateOfBirth"]));
    setSaving(false);
  };

  const remainingFields = missingFields.filter(f => !completedFields.has(f));
  const allComplete = remainingFields.length === 0;

  const handleDone = () => {
    onOpenChange(false);
    onComplete?.();
  };

  const daysInMonth = getDaysInMonth(dobMonth, dobYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${allComplete ? "bg-green-500/10" : "bg-destructive/10"}`}>
              {allComplete ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
            </div>
            <DialogTitle>{allComplete ? "Profile Complete!" : "Complete Your Profile"}</DialogTitle>
          </div>
          <DialogDescription>
            {allComplete
              ? "You can now place your order."
              : "Please complete the following information before placing an order."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Phone Verification */}
          {missingFields.includes("phone") && (
            <div className={`p-4 rounded-lg border ${completedFields.has("phone") ? "border-green-500 bg-green-50/50" : "border-border bg-muted/30"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4" />
                <span className="font-medium text-sm">Phone Number</span>
                {completedFields.has("phone") && <Check className="h-4 w-4 text-green-600 ml-auto" />}
              </div>

              {phoneVerificationStep === "input" && !completedFields.has("phone") && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <CountryCodeSelect
                      value={phoneCountryCode}
                      onValueChange={setPhoneCountryCode}
                    />
                    <Input
                      placeholder="70 123 456"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(sanitizePhoneNumber(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSendPhoneCode}
                    disabled={phoneNumber.length < 6 || sendingCode}
                    className="w-full"
                  >
                    {sendingCode ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Send Verification Code
                  </Button>
                </div>
              )}

              {phoneVerificationStep === "otp" && !completedFields.has("phone") && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-digit code sent to {phoneCountryCode} {phoneNumber}
                  </p>
                  <p className="text-xs text-primary">Demo code: 123456</p>
                  <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                    <InputOTPGroup className="gap-1">
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <InputOTPSlot key={i} index={i} className="h-10 w-10" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResendCode}
                      disabled={resendCountdown > 0 || sendingCode}
                      className="flex-1"
                    >
                      {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend Code"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleVerifyPhone}
                      disabled={otpValue.length !== 6 || verifying}
                      className="flex-1"
                    >
                      {verifying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Verify
                    </Button>
                  </div>
                </div>
              )}

              {completedFields.has("phone") && (
                <p className="text-sm text-green-600">✓ Phone verified: {phoneCountryCode} {phoneNumber}</p>
              )}
            </div>
          )}

          {/* Gender */}
          {missingFields.includes("gender") && (
            <div className={`p-4 rounded-lg border ${completedFields.has("gender") ? "border-green-500 bg-green-50/50" : "border-border bg-muted/30"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" />
                <span className="font-medium text-sm">Gender</span>
                {completedFields.has("gender") && <Check className="h-4 w-4 text-green-600 ml-auto" />}
              </div>

              {!completedFields.has("gender") && (
                <div className="flex gap-2">
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleSaveGender} disabled={!gender || saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              )}

              {completedFields.has("gender") && (
                <p className="text-sm text-green-600">✓ Gender saved</p>
              )}
            </div>
          )}

          {/* Date of Birth */}
          {missingFields.includes("dateOfBirth") && (
            <div className={`p-4 rounded-lg border ${completedFields.has("dateOfBirth") ? "border-green-500 bg-green-50/50" : "border-border bg-muted/30"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4" />
                <span className="font-medium text-sm">Date of Birth</span>
                {completedFields.has("dateOfBirth") && <Check className="h-4 w-4 text-green-600 ml-auto" />}
              </div>

              {!completedFields.has("dateOfBirth") && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={dobMonth} onValueChange={setDobMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(m => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={dobDay} onValueChange={setDobDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(d => (
                          <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={dobYear} onValueChange={setDobYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(y => (
                          <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSaveDob}
                    disabled={!dobMonth || !dobDay || !dobYear || saving}
                    className="w-full"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Date of Birth
                  </Button>
                </div>
              )}

              {completedFields.has("dateOfBirth") && (
                <p className="text-sm text-green-600">✓ Date of birth saved</p>
              )}
            </div>
          )}

          {/* Location - still redirect to profile */}
          {missingFields.includes("location") && !completedFields.has("location") && (
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium text-sm">Delivery Location</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Add at least one delivery address in your profile.</p>
            </div>
          )}

          {/* First/Last Name - redirect to profile */}
          {(missingFields.includes("firstName") || missingFields.includes("lastName")) && (
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium text-sm">Name</span>
              </div>
              <p className="text-xs text-muted-foreground">Update your name in your profile.</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {allComplete ? (
            <Button onClick={handleDone}>
              Continue to Checkout
            </Button>
          ) : (
            <Button onClick={handleDone} disabled={remainingFields.some(f => ["location", "firstName", "lastName"].includes(f)) && remainingFields.length > 0}>
              {remainingFields.some(f => ["location", "firstName", "lastName"].includes(f)) ? "Go to Profile" : "Done"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
