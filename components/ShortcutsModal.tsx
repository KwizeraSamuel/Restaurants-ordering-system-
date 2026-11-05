'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + N', desc: 'Create a new table dining order' },
    { key: 'Ctrl + P', desc: 'Print or export fiscal bill for active order' },
    { key: 'Ctrl + F', desc: 'Focus menu search box' },
    { key: 'Enter', desc: 'Add currently selected dish to active order' },
    { key: 'Delete', desc: 'Remove highlighted row from active order' },
    { key: 'Esc', desc: 'Clear search / Dismiss active dialog' },
    { key: 'F5', desc: 'Refresh menu catalog and order states' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-400 mb-2">
            Speed up cashier and waitstaff operations with high-speed POS hotkeys:
          </p>
          <div className="divide-y divide-slate-800">
            {shortcuts.map((s, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-300">{s.desc}</span>
                <kbd className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-[11px] font-mono font-bold text-blue-400 shadow-xs">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
