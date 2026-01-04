export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "On the way"
  | "Out for delivery"
  | "Delivered"
  | "Delivery failed"
  | "Cancelled";

export type ReviewPayload = {
  rating: number;
  text?: string;
  images?: string[];
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  name: string;
  variant: string;
  qty: number;
  price: number;
  imageUrl?: string;
  productUrl: string;
};

export type Order = {
  id: string;
  number: string;
  date: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  address: string;
  items: OrderItem[];
  orderReview?: ReviewPayload;
  itemReviews?: Record<string, ReviewPayload>;
};

export type ReviewTarget =
  | { type: "order"; orderId: string }
  | { type: "item"; orderId: string; itemId: string };

export type DeleteTarget =
  | { type: "order"; orderId: string }
  | { type: "item"; orderId: string; itemId: string };

export type Address = {
  id: string;
  label: string;
  fullAddress: string;
  city: string;
  isDefault: boolean;
};
