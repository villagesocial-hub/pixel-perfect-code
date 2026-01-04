import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Order, OrderItem, ReviewPayload, OrderStatus } from "@/types/orders";
import { sampleOrders } from "@/data/sample-orders";

type OrdersContextType = {
  orders: Order[];
  addOrder: (order: Omit<Order, "id">) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderReview: (orderId: string, review: ReviewPayload) => void;
  updateItemReview: (orderId: string, itemId: string, review: ReviewPayload) => void;
  deleteOrderReview: (orderId: string) => void;
  deleteItemReview: (orderId: string, itemId: string) => void;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const STORAGE_KEY = "shop-orders";

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    // Return sample orders as default
    return sampleOrders;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const addOrder = (order: Omit<Order, "id">) => {
    const id = uid();
    setOrders((prev) => [{ ...order, id }, ...prev]);
    return id;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const updateOrderReview = (orderId: string, review: ReviewPayload) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderReview: review } : o))
    );
  };

  const updateItemReview = (orderId: string, itemId: string, review: ReviewPayload) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          itemReviews: {
            ...(o.itemReviews ?? {}),
            [itemId]: review,
          },
        };
      })
    );
  };

  const deleteOrderReview = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderReview: undefined } : o))
    );
  };

  const deleteItemReview = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = { ...(o.itemReviews ?? {}) };
        delete next[itemId];
        return {
          ...o,
          itemReviews: Object.keys(next).length > 0 ? next : undefined,
        };
      })
    );
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        updateOrderReview,
        updateItemReview,
        deleteOrderReview,
        deleteItemReview,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
