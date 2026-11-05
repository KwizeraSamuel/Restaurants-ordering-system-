'use client';

import React from 'react';
import { Order, Currency } from '@/types/restaurant';
import { formatCurrency, VAT_RATE } from '@/lib/initialData';
import { sound } from '@/lib/sound';
import { X, Printer, Download, Copy, Check, FileText } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ order, currency, isOpen, onClose }: ReceiptModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !order) return null;

  const total = currency === 'UGX' ? order.totalUGX : order.totalUSD;
  const subtotal = currency === 'UGX' ? order.subtotalUGX : order.subtotalUSD;
  const tax = currency === 'UGX' ? order.taxUGX : order.taxUSD;

  const receiptDate = new Date(order.paidAt || order.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const generateRawReceiptText = (): string => {
    let b = '';
    b += '====================================================\n';
    b += '              GROUP 3 KAMPALA BISTRO                \n';
    b += '         Plot 12 Makerere Road, Kampala, UG         \n';
    b += '                  TIN: 1002938472                   \n';
    b += '====================================================\n';
    b += `Receipt No : REC-${String(order.id).padStart(6, '0')}\n`;
    b += `Table No   : ${order.tableNumber}\n`;
    b += `Server     : ${order.serverName}\n`;
    b += `Date       : ${receiptDate}\n`;
    b += `Status     : ${order.status}\n`;
    b += `Method     : ${order.paymentDetails?.method || 'PENDING'}\n`;
    if (order.paymentDetails?.momoRef) {
      b += `MoMo Ref   : ${order.paymentDetails.momoRef}\n`;
    }
    b += '----------------------------------------------------\n';
    b += `${'Description'.padEnd(22)} ${'Qty'.padStart(5)} ${'Price'.padStart(10)} ${'Amount'.padStart(10)}\n`;
    b += '----------------------------------------------------\n';

    order.items.forEach((oi) => {
      const priceStr = formatCurrency(currency === 'UGX' ? oi.unitPriceUGX : oi.unitPriceUSD, currency).replace('UGX ', '');
      const subtotalStr = formatCurrency(currency === 'UGX' ? oi.subtotalUGX : oi.subtotalUSD, currency).replace('UGX ', '');
      b += `${oi.name.slice(0, 22).padEnd(22)} ${String(oi.quantity).padStart(5)} ${priceStr.padStart(10)} ${subtotalStr.padStart(10)}\n`;
    });

    b += '----------------------------------------------------\n';
    b += `Subtotal:                           ${formatCurrency(subtotal, currency).padStart(16)}\n`;
    b += `VAT (18% included):                 ${formatCurrency(tax, currency).padStart(16)}\n`;
    b += '----------------------------------------------------\n';
    b += `TOTAL PAYABLE:                      ${formatCurrency(total, currency).padStart(16)}\n`;
    b += '====================================================\n';
    b += '         Thank you for dining with us!              \n';
    b += '      CSC 1102 Practical Exam Project - Group 3     \n';
    b += '====================================================\n';
    return b;
  };

  const handleDownloadTxt = () => {
    sound.click();
    const text = generateRawReceiptText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_Order_${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    sound.click();
    navigator.clipboard.writeText(generateRawReceiptText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    sound.click();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs no-print-overlay">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Fiscal Receipt #{order.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Realistic Thermal Receipt Slip */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex justify-center">
          <div
            id="printable-receipt"
            className="w-full max-w-sm bg-white text-slate-900 font-mono text-[11px] leading-relaxed p-6 rounded-md shadow-lg border border-slate-300 select-text"
          >
            {/* Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <div className="text-sm font-bold tracking-wider">GROUP 3 KAMPALA BISTRO</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Plot 12 Makerere Road, Kampala, UG</div>
              <div className="text-[10px] text-slate-600">Uganda Revenue Authority TIN: 1002938472</div>
              <div className="text-[10px] text-slate-500 mt-1">Tel: +256 772 000 333 / info@group3pos.ug</div>
            </div>

            {/* Meta */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span>Receipt No:</span>
                <span className="font-bold">REC-{String(order.id).padStart(6, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span>Table No:</span>
                <span>Table {order.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Server:</span>
                <span>{order.serverName}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{receiptDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-semibold text-emerald-800">
                  {order.paymentDetails?.method || 'PENDING'}
                </span>
              </div>
              {order.paymentDetails?.momoRef && (
                <div className="flex justify-between text-[9px] text-slate-600">
                  <span>Txn Ref:</span>
                  <span>{order.paymentDetails.momoRef}</span>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div className="py-2.5 border-b border-dashed border-slate-400">
              <div className="flex justify-between font-bold text-[10px] border-b border-slate-300 pb-1 mb-1.5">
                <span className="w-1/2">Item</span>
                <span className="w-12 text-center">Qty</span>
                <span className="w-16 text-right">Price</span>
                <span className="w-16 text-right">Total</span>
              </div>

              {order.items.map((oi, i) => {
                const priceStr = formatCurrency(currency === 'UGX' ? oi.unitPriceUGX : oi.unitPriceUSD, currency);
                const subStr = formatCurrency(currency === 'UGX' ? oi.subtotalUGX : oi.subtotalUSD, currency);
                return (
                  <div key={i} className="flex justify-between py-0.5 text-[10px]">
                    <span className="w-1/2 truncate font-medium">{oi.name}</span>
                    <span className="w-12 text-center">{oi.quantity}</span>
                    <span className="w-16 text-right">{priceStr.replace('UGX ', '')}</span>
                    <span className="w-16 text-right font-semibold">{subStr.replace('UGX ', '')}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="py-2.5 space-y-1 text-[11px] border-b border-dashed border-slate-400">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>VAT (18% included):</span>
                <span>{formatCurrency(tax, currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-400 text-slate-900">
                <span>TOTAL PAYABLE:</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
            </div>

            {/* Simulated Barcode & Footer */}
            <div className="pt-3 text-center space-y-2">
              <div className="tracking-[0.25em] text-[9px] font-bold text-slate-500">
                ||| | ||||| ||| |||| || |||||| | ||| ||||
              </div>
              <div className="text-[9px] text-slate-500">
                Thank you for dining with Kampala Bistro!
              </div>
              <div className="text-[8px] text-slate-400">
                CSC 1102 Exam Project • Group 3
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              title="Save Receipt_Order_XXX.txt"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save .txt</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
