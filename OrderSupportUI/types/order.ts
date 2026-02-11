export const ORDER_STATUSES = [
  "PLACED",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];


export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: {
    fullName: string;
    email: string;
    mobile: string;
  };
  items: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  timeline: OrderTimelineEntry[];
  internalNotes: OrderNote[];
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  timestampUtc: string;
  updatedBy: string;
  comment?: string;
}

export interface OrderNote {
  id: string;
  author: string;
  note: string;
  createdUtc: string;
}
