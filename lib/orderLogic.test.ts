import test from 'node:test';
import assert from 'node:assert/strict';
import {
  recalculateOrderTotals,
  calculateSplitBill,
  canDeductStock,
  convertPricePair,
} from './orderLogic';
import { INITIAL_MENU, INITIAL_ORDERS } from './initialData';

test('recalculateOrderTotals computes accurate subtotal, 18% VAT, and total without discount', () => {
  const baseOrder = INITIAL_ORDERS[0];
  const updated = recalculateOrderTotals(baseOrder, '2026-11-05T16:00:00.000Z');
  assert.equal(updated.subtotalUGX, 30000);
  assert.equal(updated.taxUGX, 5400);
  assert.equal(updated.totalUGX, 35400);
  assert.equal(updated.subtotalUSD, 8.0);
  assert.equal(updated.taxUSD, 1.44);
  assert.equal(updated.totalUSD, 9.44);
});

test('recalculateOrderTotals applies percentage discount before computing 18% VAT', () => {
  const discountedOrder = {
    ...INITIAL_ORDERS[0],
    discountPercent: 10,
  };
  const updated = recalculateOrderTotals(discountedOrder, '2026-11-05T16:00:00.000Z');
  assert.equal(updated.discountUGX, 3000);
  assert.equal(updated.taxUGX, Math.round(27000 * 0.18)); // 4860
  assert.equal(updated.totalUGX, 27000 + 4860); // 31860
});

test('calculateSplitBill divides UGX and USD totals accurately across guests', () => {
  assert.equal(calculateSplitBill(35400, 2, 'UGX'), 17700);
  assert.equal(calculateSplitBill(35400, 3, 'UGX'), 11800);
  assert.equal(calculateSplitBill(9.44, 2, 'USD'), 4.72);
});

test('canDeductStock validates available catalog inventory', () => {
  assert.equal(canDeductStock(INITIAL_MENU, 1, 5), true);
  assert.equal(canDeductStock(INITIAL_MENU, 1, 500), false);
  assert.equal(canDeductStock(INITIAL_MENU, 999, 1), false);
});

test('convertPricePair converts accurately between UGX and USD at 3750 rate', () => {
  const fromUGX = convertPricePair(15000, 'UGX');
  assert.equal(fromUGX.priceUGX, 15000);
  assert.equal(fromUGX.priceUSD, 4.0);

  const fromUSD = convertPricePair(2.0, 'USD');
  assert.equal(fromUSD.priceUSD, 2.0);
  assert.equal(fromUSD.priceUGX, 7500);
});
