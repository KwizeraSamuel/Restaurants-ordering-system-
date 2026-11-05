export type OrderStatus = 'OPEN' | 'PREPARING' | 'SERVED' | 'PAID' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'MOBILE_MONEY' | 'CREDIT_CARD';

export type Currency = 'UGX' | 'USD';

export interface MenuItem {
  id: number;
  name: string;
  category: 'Breakfast' | 'Mains' | 'Specials' | 'Sides' | 'Beverages' | 'Desserts';
  priceUGX: number;
  priceUSD: number;
  stockQuantity: number;
  initialStock: number;
  description: string;
  isPopular?: boolean;
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  category: string;
  unitPriceUGX: number;
  unitPriceUSD: number;
  quantity: number;
  subtotalUGX: number;
  subtotalUSD: number;
  notes?: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  momoProvider?: 'MTN' | 'AIRTEL';
  momoPhone?: string;
  momoRef?: string;
  cashTendered?: number;
  cashChange?: number;
  cardRef?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  tableNumber: number;
  status: OrderStatus;
  serverName: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  servedAt?: string;
  paidAt?: string;
  paymentDetails?: PaymentDetails;
  totalUGX: number;
  totalUSD: number;
  subtotalUGX: number;
  subtotalUSD: number;
  taxUGX: number;
  taxUSD: number;
}

export interface TableInfo {
  id: number;
  zone: 'Main Dining' | 'Terrace' | 'VIP Lounge' | 'Garden';
  seats: number;
  status: 'FREE' | 'OCCUPIED' | 'SERVED' | 'BILL_REQUESTED';
  activeOrderId?: number;
}

export interface ToastMessage {
  id: string;
  text: string;
  kind: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: number;
}
