import { useState, useEffect } from "react";
import { AlertTriangle, Phone, Mail, User, Calendar, Users, Check, Loader2 } from "lucide-react";
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  const [emailVerified, setEmailVerified] = useState(false);

  // Form state for non-verification fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");

  // Email state
  const [email, setEmail] = useState("");
  const [emailVerificationStep, setEmailVerificationStep] = useState<"input" | "otp" | "verified">("input");
  const [emailOtpValue, setEmailOtpValue] = useState("");
  const [emailOtpError, setEmailOtpError] = useState("");
  const [emailSendingCode, setEmailSendingCode] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailResendCountdown, setEmailResendCountdown] = useState(0);

  // Phone state
  const [phoneCountryCode, setPhoneCountryCode] = useState("+961");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneVerificationStep, setPhoneVerificationStep] = useState<"input" | "otp" | "verified">("input");
  const [phoneOtpValue, setPhoneOtpValue] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [phoneSendingCode, setPhoneSendingCode] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneResendCountdown, setPhoneResendCountdown] = useState(0);

  // Resend countdown timers
  useEffect(() => {
    if (emailResendCountdown > 0) {
      const timer = setTimeout(() => setEmailResendCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailResendCountdown]);

  useEffect(() => {
    if (phoneResendCountdown > 0) {
      const timer = setTimeout(() => setPhoneResendCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phoneResendCountdown]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      const profile = getStoredProfile();
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setGender(profile.gender || "");
      setEmail(profile.email || "");
      
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

      // Reset email verification
      setEmailVerificationStep(profile.emailVerified ? "verified" : "input");
      setEmailVerified(profile.emailVerified || false);
      setEmailOtpValue("");
      setEmailOtpError("");

      // Reset phone verification
      setPhoneVerificationStep(profile.phoneVerified ? "verified" : "input");
      setPhoneVerified(profile.phoneVerified || false);
      setPhoneOtpValue("");
      setPhoneOtpError("");
      
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

  // Email verification handlers
  const handleSendEmailCode = async () => {
    if (!isValidEmail(email)) return;
    
    setEmailSendingCode(true);
    await new Promise(r => setTimeout(r, 1000));
    setEmailSendingCode(false);
    setEmailVerificationStep("otp");
    setEmailResendCountdown(60);
  };

  const handleVerifyEmail = async () => {
    if (emailOtpValue.length !== 6) {
      setEmailOtpError("Please enter all 6 digits");
      return;
    }

    setEmailVerifying(true);
    await new Promise(r => setTimeout(r, 800));

    if (emailOtpValue === DEMO_CODE) {
      saveProfile({ email: email.trim(), emailVerified: true });
      setEmailVerificationStep("verified");
      setEmailVerified(true);
      setEmailVerifying(false);
    } else {
      setEmailOtpError("Invalid code. Try: 123456");
      setEmailVerifying(false);
    }
  };

  const handleResendEmailCode = async () => {
    setEmailSendingCode(true);
    await new Promise(r => setTimeout(r, 1000));
    setEmailSendingCode(false);
    setEmailOtpValue("");
    setEmailOtpError("");
    setEmailResendCountdown(60);
  };

  // Phone verification handlers
  const handleSendPhoneCode = async () => {
    if (phoneNumber.length < 6) return;
    
    setPhoneSendingCode(true);
    await new Promise(r => setTimeout(r, 1000));
    setPhoneSendingCode(false);
    setPhoneVerificationStep("otp");
    setPhoneResendCountdown(60);
  };

  const handleVerifyPhone = async () => {
    if (phoneOtpValue.length !== 6) {
      setPhoneOtpError("Please enter all 6 digits");
      return;
    }

    setPhoneVerifying(true);
    await new Promise(r => setTimeout(r, 800));

    if (phoneOtpValue === DEMO_CODE) {
      const fullPhone = `${phoneCountryCode} ${phoneNumber}`.trim();
      saveProfile({ phone: fullPhone, phoneVerified: true });
      setPhoneVerificationStep("verified");
      setPhoneVerified(true);
      setPhoneVerifying(false);
    } else {
      setPhoneOtpError("Invalid code. Try: 123456");
      setPhoneVerifying(false);
    }
  };

  const handleResendPhoneCode = async () => {
    setPhoneSendingCode(true);
    await new Promise(r => setTimeout(r, 1000));
    setPhoneSendingCode(false);
    setPhoneOtpValue("");
    setPhoneOtpError("");
    setPhoneResendCountdown(60);
  };

  // Check which fields need to be filled
  const needsFirstName = missingFields.includes("firstName");
  const needsLastName = missingFields.includes("lastName");
  const needsGender = missingFields.includes("gender");
  const needsDob = missingFields.includes("dateOfBirth");
  const needsEmail = missingFields.includes("email");
  const needsPhone = missingFields.includes("phone");

  const hasNonVerificationFields = needsFirstName || needsLastName || needsGender || needsDob;

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
  const nonVerificationFieldsComplete = !hasNonVerificationFields || (
    firstName.trim().length >= 2 && 
    lastName.trim().length >= 2 && 
    gender.length > 0 && 
    dobMonth && dobDay && dobYear
  );
  const emailComplete = !needsEmail || emailVerified;
  const phoneComplete = !needsPhone || phoneVerified;
  const allComplete = nonVerificationFieldsComplete && emailComplete && phoneComplete;

  const handleDone = async () => {
    // Save non-verification fields first if needed
    if (hasNonVerificationFields && canSave) {
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

          {/* Email Verification */}
          {needsEmail && (
            <div className={`p-4 rounded-lg border ${emailVerified ? "border-green-500 bg-green-50/50" : "border-border bg-muted/30"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4" />
                <span className="font-medium text-sm">Email Verification</span>
                {emailVerified && <Check className="h-4 w-4 text-green-600 ml-auto" />}
              </div>

              {emailVerificationStep === "input" && !emailVerified && (
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendEmailCode}
                    disabled={!isValidEmail(email) || emailSendingCode}
                    className="w-full"
                  >
                    {emailSendingCode ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Send Verification Code
                  </Button>
                </div>
              )}

              {emailVerificationStep === "otp" && !emailVerified && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-digit code sent to {email}
                  </p>
                  <p className="text-xs text-primary">Demo code: 123456</p>
                  <InputOTP maxLength={6} value={emailOtpValue} onChange={setEmailOtpValue}>
                    <InputOTPGroup className="gap-1">
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <InputOTPSlot key={i} index={i} className="h-10 w-10" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {emailOtpError && <p className="text-xs text-destructive">{emailOtpError}</p>}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResendEmailCode}
                      disabled={emailResendCountdown > 0 || emailSendingCode}
                      className="flex-1"
                    >
                      {emailResendCountdown > 0 ? `Resend in ${emailResendCountdown}s` : "Resend Code"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleVerifyEmail}
                      disabled={emailOtpValue.length !== 6 || emailVerifying}
                      className="flex-1"
                    >
                      {emailVerifying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Verify
                    </Button>
                  </div>
                </div>
              )}

              {emailVerified && (
                <p className="text-sm text-green-600">✓ Email verified: {email}</p>
              )}
            </div>
          )}

          {/* Phone Verification */}
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
                    disabled={phoneNumber.length < 6 || phoneSendingCode}
                    className="w-full"
                  >
                    {phoneSendingCode ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
                  <InputOTP maxLength={6} value={phoneOtpValue} onChange={setPhoneOtpValue}>
                    <InputOTPGroup className="gap-1">
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <InputOTPSlot key={i} index={i} className="h-10 w-10" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {phoneOtpError && <p className="text-xs text-destructive">{phoneOtpError}</p>}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResendPhoneCode}
                      disabled={phoneResendCountdown > 0 || phoneSendingCode}
                      className="flex-1"
                    >
                      {phoneResendCountdown > 0 ? `Resend in ${phoneResendCountdown}s` : "Resend Code"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleVerifyPhone}
                      disabled={phoneOtpValue.length !== 6 || phoneVerifying}
                      className="flex-1"
                    >
                      {phoneVerifying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
