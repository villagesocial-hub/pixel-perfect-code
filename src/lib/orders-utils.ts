import type { Order, OrderStatus } from "@/types/orders";

export function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function statusTone(status: OrderStatus) {
  if (status === "Delivered") return "success" as const;
  if (status === "Delivery failed" || status === "Cancelled") return "destructive" as const;
  if (status === "On the way" || status === "Out for delivery") return "secondary" as const;
  return "outline" as const;
}

export function makeSvgThumbDataUrl(label: string) {
  const text = String(label || "ITEM").toUpperCase().slice(0, 8);
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>" +
    "<rect x='0' y='0' width='96' height='96' rx='18' fill='#f4f4f5'/>" +
    "<path d='M20 60 L40 40 L56 56 L67 48 L76 60 L76 76 L20 76 Z' fill='#71717a' opacity='0.25'/>" +
    "<circle cx='34' cy='34' r='7' fill='#71717a' opacity='0.25'/>" +
    "<text x='48' y='54' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='14' fill='#71717a' opacity='0.9'>" +
    text +
    "</text></svg>";
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function safeFilename(s: string) {
  return String(s || "document").replace(/[^a-zA-Z0-9 _.-]+/g, " ").trim();
}

export function downloadFile(filename: string, mime: string, content: string) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }, 1500);
}

export function docText(order: Order) {
  const lines = [
    `Order: ${order.number}`,
    `Date: ${order.date}`,
    `Status: ${order.status}`,
    `Total: ${formatMoney(order.total)}`,
    `Payment: ${order.paymentMethod}`,
    `Address: ${order.address}`,
    "Items:",
    ...order.items.map((it) => `- ${it.name} (${it.variant}) x${it.qty}  ${formatMoney(it.price)}`),
    "",
    "This is a prototype document.",
  ];
  return lines.join("\n");
}

export function nowStamp() {
  return new Date().toISOString();
}

export function reviewedCounts(order: Order) {
  const itemReviewed = Object.keys(order.itemReviews ?? {}).length;
  const itemsTotal = order.items.length;
  const orderReviewed = Boolean(order.orderReview);
  return { itemReviewed, itemsTotal, orderReviewed };
}

export function reviewDisabledReason(order: Order) {
  if (order.status !== "Delivered") return "You can review this order once it has been delivered.";
  return "";
}
