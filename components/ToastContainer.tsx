'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastMessage } from '@/types/restaurant';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          let bg = 'bg-slate-800 border-slate-700 text-slate-100';
          let Icon = Info;
          let iconColor = 'text-blue-400';

          if (toast.kind === 'SUCCESS') {
            bg = 'bg-emerald-950/90 border-emerald-700/80 text-emerald-100';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-400';
          } else if (toast.kind === 'WARNING') {
            bg = 'bg-amber-950/90 border-amber-700/80 text-amber-100';
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
          } else if (toast.kind === 'ERROR') {
            bg = 'bg-rose-950/90 border-rose-700/80 text-rose-100';
            Icon = AlertCircle;
            iconColor = 'text-rose-400';
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md ${bg}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
                <span className="text-xs font-medium leading-relaxed">{toast.text}</span>
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-white p-0.5 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
