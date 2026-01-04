import type { Address } from "@/types/orders";

export const sampleAddresses: Address[] = [
  {
    id: "addr1",
    label: "Home",
    fullAddress: "Beirut, Badaro, Example Street 9, Building A, Floor 3",
    city: "Beirut",
    isDefault: true,
  },
  {
    id: "addr2",
    label: "Work",
    fullAddress: "Beirut, Downtown, Business Center, Office 501",
    city: "Beirut",
    isDefault: false,
  },
  {
    id: "addr3",
    label: "Parents",
    fullAddress: "Tripoli, El Mina, Seaside Road 45",
    city: "Tripoli",
    isDefault: false,
  },
];
