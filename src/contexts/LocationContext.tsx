import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

export type Location = {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  region: string;
  country: string;
  notes: string;
  isPrimary: boolean;
};

type LocationContextType = {
  locations: Location[];
  selectedLocationId: string | null;
  primaryLocation: Location | undefined;
  selectedLocation: Location | undefined;
  addLocation: (location: Omit<Location, "id">) => string;
  updateLocation: (id: string, location: Partial<Omit<Location, "id">>) => void;
  removeLocation: (id: string) => void;
  setPrimary: (id: string) => void;
  selectLocation: (id: string) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const STORAGE_KEY = "shop-locations";
const SELECTED_KEY = "shop-selected-location";

export function LocationProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<Location[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return [
      {
        id: uid(),
        label: "Home",
        addressLine: "Hamra, Bliss Street, Building 12",
        city: "Beirut",
        region: "Beirut",
        country: "Lebanon",
        notes: "Call on arrival",
        isPrimary: true,
      },
    ];
  });

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(SELECTED_KEY);
      return stored || null;
    } catch {}
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
    } catch {}
  }, [locations]);

  useEffect(() => {
    try {
      if (selectedLocationId) {
        localStorage.setItem(SELECTED_KEY, selectedLocationId);
      } else {
        localStorage.removeItem(SELECTED_KEY);
      }
    } catch {}
  }, [selectedLocationId]);

  const primaryLocation = useMemo(() => locations.find((l) => l.isPrimary), [locations]);
  
  const selectedLocation = useMemo(() => {
    if (selectedLocationId) {
      return locations.find((l) => l.id === selectedLocationId);
    }
    return primaryLocation;
  }, [locations, selectedLocationId, primaryLocation]);

  const addLocation = (location: Omit<Location, "id">) => {
    const id = uid();
    const isFirst = locations.length === 0;
    setLocations((prev) => [
      ...prev,
      { ...location, id, isPrimary: isFirst ? true : location.isPrimary },
    ]);
    return id;
  };

  const updateLocation = (id: string, updates: Partial<Omit<Location, "id">>) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const removeLocation = (id: string) => {
    setLocations((prev) => {
      const target = prev.find((l) => l.id === id);
      const remaining = prev.filter((l) => l.id !== id);
      if (target?.isPrimary && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isPrimary: true };
      }
      return remaining;
    });
    if (selectedLocationId === id) {
      setSelectedLocationId(null);
    }
  };

  const setPrimary = (id: string) => {
    setLocations((prev) =>
      prev.map((l) => ({ ...l, isPrimary: l.id === id }))
    );
  };

  const selectLocation = (id: string) => {
    setSelectedLocationId(id);
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        selectedLocationId,
        primaryLocation,
        selectedLocation,
        addLocation,
        updateLocation,
        removeLocation,
        setPrimary,
        selectLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocations() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocations must be used within a LocationProvider");
  }
  return context;
}
