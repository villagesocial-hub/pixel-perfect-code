import { Link } from "react-router-dom";
import { AlertTriangle, MapPin, Phone, Mail, User, Calendar, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type MissingField = "location" | "contact" | "phone" | "email" | "firstName" | "lastName" | "gender" | "dateOfBirth";

interface ProfileValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingFields: MissingField[];
}

const fieldConfig: Record<MissingField, { icon: React.ElementType; label: string; description: string }> = {
  firstName: {
    icon: User,
    label: "First Name",
    description: "Add your first name",
  },
  lastName: {
    icon: User,
    label: "Last Name",
    description: "Add your last name",
  },
  location: {
    icon: MapPin,
    label: "Delivery Location",
    description: "Add at least one delivery address",
  },
  contact: {
    icon: User,
    label: "Contact Information",
    description: "Add an email or phone number",
  },
  phone: {
    icon: Phone,
    label: "Verified Phone Number",
    description: "Add and verify your phone number for delivery updates",
  },
  email: {
    icon: Mail,
    label: "Verified Email Address",
    description: "Add and verify your email for order confirmations",
  },
  gender: {
    icon: Users,
    label: "Gender",
    description: "Select your gender",
  },
  dateOfBirth: {
    icon: Calendar,
    label: "Date of Birth",
    description: "Add your date of birth",
  },
};

export function ProfileValidationDialog({ open, onOpenChange, missingFields }: ProfileValidationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Complete Your Profile</DialogTitle>
          </div>
          <DialogDescription>
            Please complete the following information in your profile before placing an order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {missingFields.map((field) => {
            const config = fieldConfig[field];
            const Icon = config.icon;
            return (
              <div
                key={field}
                className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30"
              >
                <div className="p-1.5 rounded-md bg-foreground/10">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{config.label}</p>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Link to="/profile">
            <Button>Go to Profile</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
