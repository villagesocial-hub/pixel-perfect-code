import { CheckCircle2, AlertCircle, Package } from "lucide-react";
import type { OrderStatus } from "@/types/orders";

interface StatusIconProps {
  status: OrderStatus;
}

export function StatusIcon({ status }: StatusIconProps) {
  if (status === "Delivered") return <CheckCircle2 className="h-4 w-4" />;
  if (status === "Delivery failed") return <AlertCircle className="h-4 w-4" />;
  return <Package className="h-4 w-4" />;
}
