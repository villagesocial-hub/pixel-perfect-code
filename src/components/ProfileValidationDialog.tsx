import { useState, useEffect } from "react";
import { AlertTriangle, Phone, User, Calendar, Users, Check, Loader2 } from "lucide-react";
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
  const [saving, setSaving] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Form state for non-verification fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");

  // Phone state
  const [phoneCountryCode, setPhoneCountryCode] = useState("+961");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneVerificationStep, setPhoneVerificationStep] = useState<"input" | "otp" | "verified">("input");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

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
      const profile = getStoredProfile();
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setGender(profile.gender || "");
      
      // Parse existing DOB
      if (profile.dateOfBirth) {
        const parts = profile.dateOfBirth.split("-");
        if (parts.length === 3) {
          setDobYear(parts[0]);
          setDobMonth(parts[1]);
          setDobDay(parts[2]);
        }
      } else {
        setDobMonth("");
        setDobDay("");
        setDobYear("");
      }

      // Reset phone verification
      setPhoneVerificationStep(profile.phoneVerified ? "verified" : "input");
      setPhoneVerified(profile.phoneVerified || false);
      setOtpValue("");
      setOtpError("");
      
      if (profile.phone) {
        const code = getCountryCodeFromPhone(profile.phone);
        setPhoneCountryCode(code);
        setPhoneNumber(profile.phone.slice(code.length).trim());
      } else {
        setPhoneCountryCode("+961");
        setPhoneNumber("");
      }
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
      setPhoneVerified(true);
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

  // Check which non-phone fields need to be filled
  const needsFirstName = missingFields.includes("firstName");
  const needsLastName = missingFields.includes("lastName");
  const needsGender = missingFields.includes("gender");
  const needsDob = missingFields.includes("dateOfBirth");
  const needsPhone = missingFields.includes("phone");

  const hasNonPhoneFields = needsFirstName || needsLastName || needsGender || needsDob;

  // Validation for save button
  const isFirstNameValid = !needsFirstName || firstName.trim().length >= 2;
  const isLastNameValid = !needsLastName || lastName.trim().length >= 2;
  const isGenderValid = !needsGender || gender.length > 0;
  const isDobValid = !needsDob || (dobMonth && dobDay && dobYear);
  const canSave = isFirstNameValid && isLastNameValid && isGenderValid && isDobValid;

  const handleSaveAll = async () => {
    if (!canSave) return;

    setSaving(true);
    await new Promise(r => setTimeout(r, 500));

    const updates: Partial<StoredProfile> = {};
    
    if (needsFirstName) updates.firstName = firstName.trim();
    if (needsLastName) updates.lastName = lastName.trim();
    if (needsGender) updates.gender = gender;
    if (needsDob) {
      updates.dateOfBirth = `${dobYear}-${dobMonth}-${dobDay.padStart(2, "0")}`;
    }

    saveProfile(updates);
    setSaving(false);
  };

  // Check if all fields are complete
  const nonPhoneFieldsComplete = !hasNonPhoneFields || (isFirstNameValid && isLastNameValid && isGenderValid && isDobValid && 
    firstName.trim().length >= 2 && lastName.trim().length >= 2 && gender.length > 0 && dobMonth && dobDay && dobYear);
  const phoneComplete = !needsPhone || phoneVerified;
  const allComplete = nonPhoneFieldsComplete && phoneComplete;

  const handleDone = async () => {
    // Save non-phone fields first if needed
    if (hasNonPhoneFields && canSave) {
      await handleSaveAll();
    }
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
          {/* First Name */}
          {needsFirstName && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium text-sm">First Name</span>
              </div>
              <Input
                placeholder="Enter your first name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
          )}

          {/* Last Name */}
          {needsLastName && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium text-sm">Last Name</span>
              </div>
              <Input
                placeholder="Enter your last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          )}

          {/* Gender */}
          {needsGender && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium text-sm">Gender</span>
              </div>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date of Birth */}
          {needsDob && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium text-sm">Date of Birth</span>
              </div>
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
            </div>
          )}

          {/* Phone Verification - Separate Section */}
          {needsPhone && (
            <div className={`p-4 rounded-lg border ${phoneVerified ? "border-green-500 bg-green-50/50" : "border-border bg-muted/30"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4" />
                <span className="font-medium text-sm">Phone Verification</span>
                {phoneVerified && <Check className="h-4 w-4 text-green-600 ml-auto" />}
              </div>

              {phoneVerificationStep === "input" && !phoneVerified && (
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

              {phoneVerificationStep === "otp" && !phoneVerified && (
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

              {phoneVerified && (
                <p className="text-sm text-green-600">✓ Phone verified: {phoneCountryCode} {phoneNumber}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDone} 
            disabled={!allComplete || saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {allComplete ? "Continue to Checkout" : "Save & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
