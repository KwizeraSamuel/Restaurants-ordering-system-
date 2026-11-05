'use client';

import React from 'react';
import { Currency } from '@/types/restaurant';
import { Volume2, VolumeX, Keyboard, Code2, Sparkles, DollarSign } from 'lucide-react';
import { sound } from '@/lib/sound';

interface TopNavigationProps {
  activeView: 'pos' | 'kds' | 'floor' | 'inventory' | 'analytics' | 'java';
  setActiveView: (view: 'pos' | 'kds' | 'floor' | 'inventory' | 'analytics' | 'java') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenShortcuts: () => void;
  onOpenJavaModal: () => void;
  onNewOrder: () => void;
  shiftRevenueFormatted: string;
  activeOrderCount: number;
}

export function TopNavigation({
  activeView,
  setActiveView,
  currency,
  setCurrency,
  soundEnabled,
  setSoundEnabled,
  onOpenShortcuts,
  onOpenJavaModal,
  onNewOrder,
  shiftRevenueFormatted,
  activeOrderCount,
}: TopNavigationProps) {
  const [time, setTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.click();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-slate-100 sticky top-0 z-40">
      {/* Zone 1, 2, 3 Main Top Bar Contract */}
      <div className="flex items-center justify-between gap-8 px-6 py-3.5 max-w-[1700px] mx-auto">
        {/* Zone 1: Brand Wordmark (Single clean element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
            KB
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Kampala Bistro POS
          </span>
        </div>

        {/* Zone 2: Navigation Links (Clean text links with subtle hover/active state) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              sound.click();
              setActiveView('pos');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'pos'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            POS Terminal
          </button>
          <button
            onClick={() => {
              sound.click();
              setActiveView('kds');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
              activeView === 'kds'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            <span>Kitchen Display</span>
            {activeOrderCount > 0 && (
              <span className="text-xs font-mono px-1.5 py-0.2 bg-blue-600 text-white rounded">
                {activeOrderCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              sound.click();
              setActiveView('floor');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'floor'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Floor Plan
          </button>
          <button
            onClick={() => {
              sound.click();
              setActiveView('inventory');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'inventory'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Inventory & Stock
          </button>
          <button
            onClick={() => {
              sound.click();
              setActiveView('analytics');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'analytics'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Shift Sales
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewOrder}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 shadow-sm"
            title="Start new order (Ctrl+N)"
          >
            + New Order
          </button>
        </div>
      </div>

      {/* Sub-toolbar: Operational context, Currency switcher, Sound, Group 3 Exam badge & Clock */}
      <div className="bg-slate-900 border-t border-slate-800/80 px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-slate-400">
          <span className="text-slate-200 font-medium">Group 3 • CSC 1102 Practical Exam</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <button
            onClick={onOpenJavaModal}
            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Java Source Code & Team</span>
          </button>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">
            Shift Sales:{' '}
            <strong className="text-emerald-400 font-mono tabular-nums text-sm">
              {shiftRevenueFormatted}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile view switcher for small viewports */}
          <div className="flex lg:hidden items-center gap-1 bg-slate-800 p-0.5 rounded-md">
            <button
              onClick={() => setActiveView('pos')}
              className={`px-2 py-1 rounded text-xs ${
                activeView === 'pos' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              POS
            </button>
            <button
              onClick={() => setActiveView('kds')}
              className={`px-2 py-1 rounded text-xs ${
                activeView === 'kds' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              KDS
            </button>
            <button
              onClick={() => setActiveView('floor')}
              className={`px-2 py-1 rounded text-xs ${
                activeView === 'floor' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              Floor
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-800 rounded-md p-0.5 text-xs">
            <button
              onClick={() => {
                sound.click();
                setCurrency('UGX');
              }}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                currency === 'UGX'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UGX
            </button>
            <button
              onClick={() => {
                sound.click();
                setCurrency('USD');
              }}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                currency === 'USD'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USD
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Keyboard Shortcuts Guide */}
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Clock */}
          <div className="font-mono text-slate-300 tabular-nums px-2 py-0.5 bg-slate-800/80 rounded border border-slate-700/50">
            {time || '00:00:00'}
          </div>
        </div>
      </div>
    </header>
  );
}
