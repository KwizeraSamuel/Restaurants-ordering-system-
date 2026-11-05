'use client';

import React from 'react';
import { Order, Currency, PaymentMethod, PaymentDetails } from '@/types/restaurant';
import { formatCurrency } from '@/lib/initialData';
import { calculateSplitBill } from '@/lib/orderLogic';
import { sound } from '@/lib/sound';
import { X, Check, Smartphone, Banknote, CreditCard, ArrowRight, ShieldCheck, Users } from 'lucide-react';

interface PaymentModalProps {
  order: Order | null;
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (method: PaymentMethod, details: PaymentDetails) => void;
}

export function PaymentModal(props: PaymentModalProps) {
  if (!props.isOpen || !props.order) return null;

  return (
    <PaymentModalContent
      key={`${props.order.id}-${props.currency}`}
      order={props.order}
      currency={props.currency}
      onClose={props.onClose}
      onConfirmPayment={props.onConfirmPayment}
    />
  );
}

function PaymentModalContent({
  order,
  currency,
  onClose,
  onConfirmPayment,
}: {
  order: Order;
  currency: Currency;
  onClose: () => void;
  onConfirmPayment: (method: PaymentMethod, details: PaymentDetails) => void;
}) {
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>('CASH');
  const [splitCount, setSplitCount] = React.useState<number>(1);

  // Cash state
  const totalDue = currency === 'UGX' ? order.totalUGX : order.totalUSD;
  const [tenderedAmount, setTenderedAmount] = React.useState<number>(totalDue);

  // Mobile Money state
  const [momoProvider, setMomoProvider] = React.useState<'MTN' | 'AIRTEL'>('MTN');
  const [momoPhone, setMomoPhone] = React.useState<string>('0772 123456');
  const [momoSimulating, setMomoSimulating] = React.useState<boolean>(false);
  const [momoApproved, setMomoApproved] = React.useState<boolean>(false);

  const changeDue = Math.max(0, tenderedAmount - totalDue);
  const isCashSufficient = tenderedAmount >= totalDue;
  const perPersonAmount = calculateSplitBill(totalDue, splitCount, currency);

  const handleSimulateMoMo = () => {
    sound.click();
    setMomoSimulating(true);
    setTimeout(() => {
      setMomoSimulating(false);
      setMomoApproved(true);
      sound.addItem();
    }, 1000);
  };

  const handleCompletePayment = () => {
    if (selectedMethod === 'CASH' && !isCashSufficient) {
      sound.beep();
      return;
    }

    let details: PaymentDetails = {
      method: selectedMethod,
      splitCount: splitCount > 1 ? splitCount : undefined,
      perPersonAmount: splitCount > 1 ? perPersonAmount : undefined,
    };

    if (selectedMethod === 'CASH') {
      details = {
        ...details,
        method: 'CASH',
        cashTendered: tenderedAmount,
        cashChange: changeDue,
      };
    } else if (selectedMethod === 'MOBILE_MONEY') {
      details = {
        ...details,
        method: 'MOBILE_MONEY',
        momoProvider,
        momoPhone,
        momoRef: `${momoProvider}-TX-${100000 + (order.id * 137) % 899999}`,
      };
    } else {
      details = {
        ...details,
        method: 'CREDIT_CARD',
        cardRef: `VISA-AUTH-${1000 + (order.id * 73) % 8999}`,
      };
    }

    sound.paymentSuccess();
    onConfirmPayment(selectedMethod, details);
  };

  // Quick cash tender buttons
  const ugxPresets = [totalDue, 10000, 20000, 50000, 100000].filter(
    (v, i, arr) => v >= totalDue && arr.indexOf(v) === i
  );
  const usdPresets = [totalDue, 10, 20, 50, 100].filter(
    (v, i, arr) => v >= totalDue && arr.indexOf(v) === i
  );
  const presets = currency === 'UGX' ? ugxPresets : usdPresets;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Process Payment — Order {order.orderNumber}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Table {order.tableNumber} • Server: {order.serverName}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close payment modal"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Amount Payable
              </span>
              <div className="text-xs text-slate-500 mt-0.5">
                Includes 18% Standard VAT (
                {formatCurrency(currency === 'UGX' ? order.taxUGX : order.taxUSD, currency)})
                {(order.discountPercent ?? 0) > 0 && ` • ${order.discountPercent}% Discount Applied`}
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {formatCurrency(totalDue, currency)}
            </div>
          </div>

          {/* Split Bill Calculator Strip */}
          <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Split Bill by Guests:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setSplitCount(cnt);
                    }}
                    className={`w-6 h-6 rounded font-mono font-bold text-xs transition-colors ${
                      splitCount === cnt
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            {splitCount > 1 && (
              <div className="font-mono text-xs text-blue-300 bg-blue-950/50 border border-blue-800/60 px-2.5 py-1 rounded-md">
                {formatCurrency(perPersonAmount, currency)} / person
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Payment Gateway:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setSelectedMethod('CASH');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedMethod === 'CASH'
                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 shadow-xs'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1.5" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setSelectedMethod('MOBILE_MONEY');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedMethod === 'MOBILE_MONEY'
                    ? 'border-amber-500 bg-amber-950/30 text-amber-300 shadow-xs'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1.5" />
                <span>Mobile Money</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setSelectedMethod('CREDIT_CARD');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedMethod === 'CREDIT_CARD'
                    ? 'border-blue-500 bg-blue-950/30 text-blue-300 shadow-xs'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1.5" />
                <span>Credit Card</span>
              </button>
            </div>
          </div>

          {/* Method Specific Panels */}
          {selectedMethod === 'CASH' && (
            <div className="space-y-3.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Amount Received from Customer:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    aria-label="Cash tendered amount"
                    value={tenderedAmount}
                    onChange={(e) => setTenderedAmount(Number(e.target.value))}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTenderedAmount(totalDue)}
                    className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                  >
                    Exact
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 mr-1">Quick Tender:</span>
                {presets.slice(0, 4).map((amt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setTenderedAmount(amt);
                    }}
                    className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                      tenderedAmount === amt
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {formatCurrency(amt, currency)}
                  </button>
                ))}
              </div>

              {/* Change calculation */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Change Due to Customer:</span>
                <span
                  className={`font-mono font-bold text-sm tabular-nums ${
                    isCashSufficient ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isCashSufficient
                    ? formatCurrency(changeDue, currency)
                    : `Insufficient (${formatCurrency(totalDue - tenderedAmount, currency)} needed)`}
                </span>
              </div>
            </div>
          )}

          {selectedMethod === 'MOBILE_MONEY' && (
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setMomoProvider('MTN');
                  }}
                  className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors ${
                    momoProvider === 'MTN'
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  MTN Mobile Money
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setMomoProvider('AIRTEL');
                  }}
                  className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors ${
                    momoProvider === 'AIRTEL'
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Airtel Money
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Customer Mobile Number:
                </label>
                <input
                  type="text"
                  aria-label="Customer mobile money phone number"
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  placeholder="07XX XXXXXX"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={momoSimulating || momoApproved}
                  onClick={handleSimulateMoMo}
                  className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {momoSimulating ? (
                    <span>Waiting for PIN on phone...</span>
                  ) : momoApproved ? (
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Check className="w-3.5 h-3.5" /> Prompt Approved
                    </span>
                  ) : (
                    <span>Send USSD Payment Prompt</span>
                  )}
                </button>
                {momoApproved && (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
            </div>
          )}

          {selectedMethod === 'CREDIT_CARD' && (
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-900/40 border border-blue-700/60 flex items-center justify-center text-blue-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">POS Wireless Terminal Ready</div>
                  <div className="text-[11px] text-slate-400">Visa / Mastercard / UnionPay chip & tap</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                Card terminal will automatically process charge of{' '}
                <strong className="text-emerald-400 font-mono">
                  {formatCurrency(totalDue, currency)}
                </strong>
                .
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={selectedMethod === 'CASH' && !isCashSufficient}
            onClick={handleCompletePayment}
            className="px-5 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-all shadow-md flex items-center gap-2"
          >
            <span>Confirm & Settle Bill</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
