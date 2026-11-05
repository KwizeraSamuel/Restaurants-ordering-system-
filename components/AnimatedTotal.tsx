'use client';

import React from 'react';
import { Currency } from '@/types/restaurant';
import { formatCurrency } from '@/lib/initialData';

interface AnimatedTotalProps {
  total: number;
  subtotal: number;
  tax: number;
  currency: Currency;
}

export function AnimatedTotal({ total, subtotal, tax, currency }: AnimatedTotalProps) {
  const [displayTotal, setDisplayTotal] = React.useState(total);
  const prevTotalRef = React.useRef(total);

  React.useEffect(() => {
    const start = prevTotalRef.current;
    const end = total;
    prevTotalRef.current = total;
    if (start === end) return;

    const duration = 280; // ms
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = start + (end - start) * eased;
      setDisplayTotal(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setDisplayTotal(end);
      }
    };

    const handle = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(handle);
  }, [total]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="space-y-1.5 text-xs text-slate-400 mb-3 pb-3 border-b border-slate-800/80">
        <div className="flex justify-between items-center">
          <span>Net Subtotal:</span>
          <span className="font-mono tabular-nums text-slate-200">
            {formatCurrency(subtotal, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Standard VAT (18% included):</span>
          <span className="font-mono tabular-nums text-slate-300">
            {formatCurrency(tax, currency)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-baseline">
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Total Payable
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 tracking-tight">
          {formatCurrency(displayTotal, currency)}
        </div>
      </div>
    </div>
  );
}
