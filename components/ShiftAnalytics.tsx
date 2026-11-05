'use client';

import React from 'react';
import { Order, Currency } from '@/types/restaurant';
import { formatCurrency, VAT_RATE } from '@/lib/initialData';
import { sound } from '@/lib/sound';
import {
  TrendingUp,
  Receipt,
  CreditCard,
  Smartphone,
  Banknote,
  Award,
  Download,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface ShiftAnalyticsProps {
  orders: Order[];
  currency: Currency;
}

export function ShiftAnalytics({ orders, currency }: ShiftAnalyticsProps) {
  const paidOrders = orders.filter((o) => o.status === 'PAID');
  const activeOrders = orders.filter((o) => o.status === 'OPEN' || o.status === 'SERVED');

  const totalRevenueUGX = paidOrders.reduce((acc, o) => acc + o.totalUGX, 0);
  const totalRevenueUSD = paidOrders.reduce((acc, o) => acc + o.totalUSD, 0);
  const totalVatUGX = paidOrders.reduce((acc, o) => acc + o.taxUGX, 0);
  const totalVatUSD = paidOrders.reduce((acc, o) => acc + o.taxUSD, 0);

  const avgOrderUGX = paidOrders.length > 0 ? totalRevenueUGX / paidOrders.length : 0;
  const avgOrderUSD = paidOrders.length > 0 ? totalRevenueUSD / paidOrders.length : 0;

  // Breakdown by payment method
  const cashTotal = paidOrders
    .filter((o) => o.paymentDetails?.method === 'CASH')
    .reduce((acc, o) => (currency === 'UGX' ? acc + o.totalUGX : acc + o.totalUSD), 0);

  const momoTotal = paidOrders
    .filter((o) => o.paymentDetails?.method === 'MOBILE_MONEY')
    .reduce((acc, o) => (currency === 'UGX' ? acc + o.totalUGX : acc + o.totalUSD), 0);

  const cardTotal = paidOrders
    .filter((o) => o.paymentDetails?.method === 'CREDIT_CARD')
    .reduce((acc, o) => (currency === 'UGX' ? acc + o.totalUGX : acc + o.totalUSD), 0);

  const currentTotal = currency === 'UGX' ? totalRevenueUGX : totalRevenueUSD;

  // Item sales tally
  const itemTally: Record<string, { name: string; qty: number; revenueUGX: number; revenueUSD: number }> = {};
  paidOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemTally[item.name]) {
        itemTally[item.name] = { name: item.name, qty: 0, revenueUGX: 0, revenueUSD: 0 };
      }
      itemTally[item.name].qty += item.quantity;
      itemTally[item.name].revenueUGX += item.subtotalUGX;
      itemTally[item.name].revenueUSD += item.subtotalUSD;
    });
  });

  const topItems = Object.values(itemTally).sort((a, b) => b.qty - a.qty).slice(0, 5);

  const handleExportReport = () => {
    sound.click();
    let r = '';
    r += '====================================================\n';
    r += '       GROUP 3 KAMPALA BISTRO - SHIFT AUDIT REPORT  \n';
    r += '====================================================\n';
    r += `Generated : ${new Date().toLocaleString()}\n`;
    r += `Course    : CSC 1102 Practical Exam Project\n`;
    r += '----------------------------------------------------\n';
    r += `Total Paid Orders   : ${paidOrders.length}\n`;
    r += `Active Open Orders  : ${activeOrders.length}\n`;
    r += `Total Shift Revenue : ${formatCurrency(currentTotal, currency)}\n`;
    r += `VAT (18% collected) : ${formatCurrency(currency === 'UGX' ? totalVatUGX : totalVatUSD, currency)}\n`;
    r += `Average Order Value : ${formatCurrency(currency === 'UGX' ? avgOrderUGX : avgOrderUSD, currency)}\n`;
    r += '----------------------------------------------------\n';
    r += 'PAYMENT CHANNELS BREAKDOWN:\n';
    r += `  Cash Payments     : ${formatCurrency(cashTotal, currency)}\n`;
    r += `  Mobile Money      : ${formatCurrency(momoTotal, currency)}\n`;
    r += `  Credit/Debit Card : ${formatCurrency(cardTotal, currency)}\n`;
    r += '----------------------------------------------------\n';
    r += 'TOP SELLING ITEMS:\n';
    topItems.forEach((it, idx) => {
      r += `  ${idx + 1}. ${it.name} (${it.qty} sold) - ${formatCurrency(currency === 'UGX' ? it.revenueUGX : it.revenueUSD, currency)}\n`;
    });
    r += '====================================================\n';

    const blob = new Blob([r], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shift_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-[1700px] mx-auto p-4 md:p-6 gap-5 overflow-y-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Shift Sales Analytics & Reconciliation</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800">
              Live Audit
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cashier settlement records, tax accounting, and revenue distribution
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Shift Audit (.txt)</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Shift Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
            {formatCurrency(currentTotal, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {paidOrders.length} settled dining receipts
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Average Ticket (AOV)</span>
            <Receipt className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-2 tabular-nums">
            {formatCurrency(currency === 'UGX' ? avgOrderUGX : avgOrderUSD, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Average guest spending per table</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>VAT Collected (18%)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2 tabular-nums">
            {formatCurrency(currency === 'UGX' ? totalVatUGX : totalVatUSD, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Uganda Revenue Authority TIN tax reserve</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Open Dining Tables</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
            {activeOrders.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Orders currently active on the floor</div>
        </div>
      </div>

      {/* Main Grid: Payment Distribution & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payment Gateway Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Settlement Gateway Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Breakdown by Cash, MTN/Airtel Mobile Money, and Card Terminals
            </p>

            <div className="space-y-4">
              {/* Cash */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span>Cash</span>
                  </span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {formatCurrency(cashTotal, currency)}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${currentTotal > 0 ? (cashTotal / currentTotal) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Mobile Money */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Mobile Money (MTN / Airtel)</span>
                  </span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {formatCurrency(momoTotal, currency)}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${currentTotal > 0 ? (momoTotal / currentTotal) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Card */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="flex items-center gap-2 text-slate-200">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span>Credit / Debit Card</span>
                  </span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {formatCurrency(cardTotal, currency)}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${currentTotal > 0 ? (cardTotal / currentTotal) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
            <span>Total Settlement:</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatCurrency(currentTotal, currency)}
            </span>
          </div>
        </div>

        {/* Top Selling Dishes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Top Performing Dishes This Shift</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Most popular food and beverages ordered by volume
          </p>

          {topItems.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {topItems.map((it, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-100">{it.name}</div>
                      <div className="text-[11px] text-slate-400">{it.qty} portions sold</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-xs text-emerald-400 tabular-nums">
                    {formatCurrency(currency === 'UGX' ? it.revenueUGX : it.revenueUSD, currency)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              Complete payments to view real-time sales leaderboard.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
