'use client';

import React from 'react';
import { TableInfo, Order, Currency } from '@/types/restaurant';
import { formatCurrency } from '@/lib/initialData';
import { sound } from '@/lib/sound';
import { Users, Plus, CheckCircle2, Coffee, Clock } from 'lucide-react';

interface FloorPlanProps {
  tables: TableInfo[];
  orders: Order[];
  currency: Currency;
  onSelectTableOrder: (tableId: number, orderId?: number) => void;
}

export function FloorPlan({ tables, orders, currency, onSelectTableOrder }: FloorPlanProps) {
  const [selectedZone, setSelectedZone] = React.useState<string>('All');

  const zones = ['All', 'Main Dining', 'Terrace', 'VIP Lounge', 'Garden'];

  const filteredTables = tables.filter(
    (t) => selectedZone === 'All' || t.zone === selectedZone
  );

  const occupiedCount = tables.filter((t) => t.status !== 'FREE').length;
  const occupancyPercent = Math.round((occupiedCount / tables.length) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-[1700px] mx-auto p-4 md:p-6 gap-5">
      {/* Header and Summary stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Restaurant Table Floor Plan</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 bg-blue-950 text-blue-400 rounded-full border border-blue-800">
              {tables.length} Total Tables
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time table occupancy, guest seating, and active table bills
          </p>
        </div>

        {/* Occupancy stats strip */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">Free:</span>
            <span className="text-white font-mono font-bold">{tables.length - occupiedCount}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-slate-400">Occupied:</span>
            <span className="text-white font-mono font-bold">{occupiedCount}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Occupancy:</span>
            <span className="text-amber-400 font-mono font-bold">{occupancyPercent}%</span>
          </div>
        </div>
      </div>

      {/* Zone filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {zones.map((zone) => (
          <button
            key={zone}
            onClick={() => {
              sound.click();
              setSelectedZone(zone);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedZone === zone
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredTables.map((table) => {
            const activeOrder = orders.find((o) => o.id === table.activeOrderId);
            const isOccupied = table.status !== 'FREE' && !!activeOrder;

            let cardBorder = 'border-slate-800 bg-slate-900/80 hover:border-slate-700';
            let statusText = 'Free';
            let statusColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';

            if (isOccupied) {
              if (activeOrder.status === 'SERVED') {
                cardBorder = 'border-amber-800/80 bg-amber-950/15 hover:border-amber-700';
                statusText = 'Served';
                statusColor = 'text-amber-400 bg-amber-950/80 border-amber-800';
              } else {
                cardBorder = 'border-blue-800/80 bg-blue-950/15 hover:border-blue-700';
                statusText = 'Dining';
                statusColor = 'text-blue-400 bg-blue-950/80 border-blue-800';
              }
            }

            return (
              <div
                key={table.id}
                onClick={() => {
                  sound.click();
                  onSelectTableOrder(table.id, table.activeOrderId);
                }}
                className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer select-none text-left shadow-xs ${cardBorder}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xl font-bold font-mono text-white">
                      T{table.id}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusColor}`}
                    >
                      {statusText}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{table.seats} Seats</span>
                    <span>•</span>
                    <span className="truncate">{table.zone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs">
                  {isOccupied && activeOrder ? (
                    <div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="font-medium">{activeOrder.orderNumber}</span>
                        <span className="font-mono font-bold text-emerald-400 tabular-nums">
                          {formatCurrency(
                            currency === 'UGX' ? activeOrder.totalUGX : activeOrder.totalUSD,
                            currency
                          )}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                        <span>{activeOrder.items.length} items</span>
                        <span>{activeOrder.serverName.split(' ')[0]}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 flex items-center gap-1">
                      <Plus className="w-3 h-3 text-slate-400" />
                      <span>Click to Seat</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
