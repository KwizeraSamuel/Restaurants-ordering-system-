'use client';

import React from 'react';
import { Order, OrderStatus } from '@/types/restaurant';
import { sound } from '@/lib/sound';
import { Clock, CheckCircle, ChefHat, Bell, AlertCircle, Utensils } from 'lucide-react';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, nextStatus: OrderStatus) => void;
  onSelectOrder: (order: Order) => void;
}

export function KitchenDisplay({ orders, onUpdateStatus, onSelectOrder }: KitchenDisplayProps) {
  const [filter, setFilter] = React.useState<'ALL' | 'OPEN' | 'SERVED'>('ALL');
  const [currentTime, setCurrentTime] = React.useState<number>(() => Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter only active / open / served orders
  const activeOrders = orders.filter((o) => {
    if (o.status === 'PAID' || o.status === 'CANCELLED') return false;
    if (filter === 'OPEN') return o.status === 'OPEN';
    if (filter === 'SERVED') return o.status === 'SERVED';
    return true;
  });

  const getElapsedMinutes = (createdAt: string) => {
    const diffMs = currentTime - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-[1700px] mx-auto p-4 md:p-6 gap-5">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Kitchen Display System (KDS)</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 bg-slate-800 text-amber-400 rounded-full border border-slate-700">
                {activeOrders.length} active tickets
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live orders routed directly from waitstaff floor terminals
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              sound.click();
              setFilter('ALL');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Active
          </button>
          <button
            onClick={() => {
              sound.click();
              setFilter('OPEN');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'OPEN' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            In Kitchen (Open)
          </button>
          <button
            onClick={() => {
              sound.click();
              setFilter('SERVED');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'SERVED' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ready / Served
          </button>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeOrders.map((order) => {
              const elapsed = getElapsedMinutes(order.createdAt);
              const isUrgent = elapsed > 20;
              const isWarning = elapsed > 12 && !isUrgent;

              let timerColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
              if (isUrgent) {
                timerColor = 'text-rose-400 bg-rose-950/80 border-rose-800 animate-pulse';
              } else if (isWarning) {
                timerColor = 'text-amber-400 bg-amber-950/70 border-amber-800/80';
              }

              return (
                <div
                  key={order.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md flex flex-col justify-between"
                >
                  {/* Ticket Header */}
                  <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{order.orderNumber}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/80">
                          Table {order.tableNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Server: {order.serverName}
                      </div>
                    </div>

                    <div
                      className={`text-xs font-mono font-bold px-2 py-1 rounded-md border flex items-center gap-1 ${timerColor}`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{elapsed}m ago</span>
                    </div>
                  </div>

                  {/* Ticket Items List */}
                  <div className="p-4 flex-1 space-y-2.5 overflow-y-auto max-h-64 divide-y divide-slate-800/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-800 text-blue-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                              {item.quantity}×
                            </span>
                            <span>{item.name}</span>
                          </div>
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-amber-400/90 pl-7 mt-0.5 italic">
                            Note: {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Ticket Footer Action (Bump ticket) */}
                  <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                    >
                      View in POS
                    </button>

                    {order.status === 'OPEN' ? (
                      <button
                        onClick={() => {
                          sound.addItem();
                          onUpdateStatus(order.id, 'SERVED');
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Ready to Serve</span>
                      </button>
                    ) : (
                      <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Plated & Served
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-slate-500">
            <Utensils className="w-12 h-12 mb-3 opacity-30 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-300">All Kitchen Tickets Cleared!</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
              There are currently no pending kitchen orders. New orders placed from the POS terminal will appear here in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
