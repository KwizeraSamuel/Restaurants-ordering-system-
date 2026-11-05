import { Order, MenuItem, Currency } from '../types/restaurant';
import { VAT_RATE, EXCHANGE_RATE_USD_TO_UGX } from './initialData';

export function recalculateOrderTotals(order: Order, timestampIso?: string): Order {
  let subUGX = 0;
  let subUSD = 0;

  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    subUGX += item.subtotalUGX;
    subUSD += item.subtotalUSD;
  }

  subUSD = Number(subUSD.toFixed(2));

  const discountPct = Math.max(0, Math.min(100, order.discountPercent ?? 0));
  const discountUGX = Math.round(subUGX * (discountPct / 100));
  const discountUSD = Number((subUSD * (discountPct / 100)).toFixed(2));

  const discountedSubUGX = Math.max(0, subUGX - discountUGX);
  const discountedSubUSD = Math.max(0, Number((subUSD - discountUSD).toFixed(2)));

  const taxUGX = Math.round(discountedSubUGX * VAT_RATE);
  const taxUSD = Number((discountedSubUSD * VAT_RATE).toFixed(2));

  const totalUGX = discountedSubUGX + taxUGX;
  const totalUSD = Number((discountedSubUSD + taxUSD).toFixed(2));

  return {
    ...order,
    discountPercent: discountPct,
    discountUGX,
    discountUSD,
    subtotalUGX: subUGX,
    subtotalUSD: subUSD,
    taxUGX,
    taxUSD,
    totalUGX,
    totalUSD,
    updatedAt: timestampIso || new Date().toISOString(),
  };
}

export function calculateSplitBill(totalAmount: number, splitCount: number, currency: Currency): number {
  const safeCount = Math.max(1, Math.floor(splitCount));
  const rawShare = totalAmount / safeCount;
  if (currency === 'UGX') {
    return Math.ceil(rawShare / 100) * 100; // Round up to nearest 100 UGX coin
  }
  return Number(rawShare.toFixed(2));
}

export function canDeductStock(menu: MenuItem[], itemId: number, quantity: number): boolean {
  if (quantity <= 0) return false;
  const found = menu.find((m) => m.id === itemId);
  if (!found) return false;
  return found.stockQuantity >= quantity;
}

export function convertPricePair(amount: number, sourceCurrency: Currency): { priceUGX: number; priceUSD: number } {
  if (sourceCurrency === 'UGX') {
    const priceUGX = Math.max(0, Math.round(amount));
    const priceUSD = Number((priceUGX / EXCHANGE_RATE_USD_TO_UGX).toFixed(2));
    return { priceUGX, priceUSD };
  }
  const priceUSD = Math.max(0, Number(amount.toFixed(2)));
  const priceUGX = Math.round(priceUSD * EXCHANGE_RATE_USD_TO_UGX);
  return { priceUGX, priceUSD };
}
