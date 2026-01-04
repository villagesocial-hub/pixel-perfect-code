import { useMemo, useState, useCallback } from "react";
import { useLocations } from "@/contexts/LocationContext";

// This hook checks if the user's profile has enough data to place an order

type MissingField = "location" | "contact" | "phone" | "email" | "firstName" | "lastName" | "gender" | "dateOfBirth";

const PROFILE_STORAGE_KEY = "user-profile";

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

// Default profile values (simulating email signup - names predicted from email handle)
const defaultProfile: StoredProfile = {
  firstName: "Antoun",
  lastName: "Elmorr",
  email: "antoun.elmorr@example.com",
  phone: "",
  emailVerified: true,
  phoneVerified: false,
  gender: "",
  dateOfBirth: "",
};

function getStoredProfile(): StoredProfile {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      const merged = { ...defaultProfile, ...JSON.parse(stored) } as StoredProfile;

      // One-time migration: older demo profiles had a prefilled phone number.
      if (merged.emailVerified && !merged.phoneVerified && merged.phone === "+961 70 123 456") {
        merged.phone = "";
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
      }

      return merged;
    }
  } catch {
    // Ignore parsing errors
  }
  return defaultProfile;
}

function hasMinLength(value: string | undefined, n: number): boolean {
  return Boolean(value && value.trim().length >= n);
}

function isValidEmail(value: string | undefined): boolean {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

export function useProfileValidation() {
  const { locations, selectedLocation } = useLocations();
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  const validation = useMemo(() => {
    const profile = getStoredProfile();
    const missingFields: MissingField[] = [];

    // Check for first name
    if (!hasMinLength(profile.firstName, 2)) {
      missingFields.push("firstName");
    }

    // Check for last name
    if (!hasMinLength(profile.lastName, 2)) {
      missingFields.push("lastName");
    }

    // Check for location - need at least one location
    const hasLocation = locations.length > 0;
    if (!hasLocation) {
      missingFields.push("location");
    }

    // Check for verified email
    const hasEmail = isValidEmail(profile.email);
    const emailVerified = Boolean(profile.emailVerified);
    if (!hasEmail || !emailVerified) {
      missingFields.push("email");
    }

    // Check for verified phone
    const hasPhone = hasMinLength(profile.phone, 6);
    const phoneVerified = Boolean(profile.phoneVerified);
    if (!hasPhone || !phoneVerified) {
      missingFields.push("phone");
    }

    // Check for gender
    if (!hasMinLength(profile.gender, 1)) {
      missingFields.push("gender");
    }

    // Check for date of birth
    if (!hasMinLength(profile.dateOfBirth, 1)) {
      missingFields.push("dateOfBirth");
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      hasLocation,
      hasSelectedLocation: Boolean(selectedLocation),
      hasEmail,
      hasPhone,
    };
  }, [locations, selectedLocation, refreshKey]);

  return { ...validation, refresh };
}
