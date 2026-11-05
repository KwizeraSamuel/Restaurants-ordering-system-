'use client';

import React from 'react';
import { MenuItem, Currency } from '@/types/restaurant';
import { formatCurrency } from '@/lib/initialData';
import { sound } from '@/lib/sound';
import { Package, AlertTriangle, Search, Plus, RefreshCw, DollarSign } from 'lucide-react';

interface InventoryManagerProps {
  menu: MenuItem[];
  currency: Currency;
  onRestock: (itemId: number, amount: number) => void;
  onUpdatePrice: (itemId: number, priceUGX: number, priceUSD: number) => void;
}

export function InventoryManager({
  menu,
  currency,
  onRestock,
  onUpdatePrice,
}: InventoryManagerProps) {
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [editingItemId, setEditingItemId] = React.useState<number | null>(null);
  const [editPrice, setEditPrice] = React.useState<number>(0);

  const categories = ['All', 'Breakfast', 'Mains', 'Specials', 'Sides', 'Beverages', 'Desserts'];

  const filtered = menu.filter((item) => {
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchSearch =
      search.trim() === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const lowStockCount = menu.filter((item) => item.stockQuantity > 0 && item.stockQuantity <= 10).length;
  const outOfStockCount = menu.filter((item) => item.stockQuantity === 0).length;

  const totalValueUGX = menu.reduce((acc, it) => acc + it.priceUGX * it.stockQuantity, 0);
  const totalValueUSD = menu.reduce((acc, it) => acc + it.priceUSD * it.stockQuantity, 0);

  const handleStartEdit = (item: MenuItem) => {
    sound.click();
    setEditingItemId(item.id);
    setEditPrice(currency === 'UGX' ? item.priceUGX : item.priceUSD);
  };

  const handleSavePrice = (item: MenuItem) => {
    sound.addItem();
    if (currency === 'UGX') {
      const priceUGX = editPrice;
      const priceUSD = Number((editPrice / 3750).toFixed(2));
      onUpdatePrice(item.id, priceUGX, priceUSD);
    } else {
      const priceUSD = editPrice;
      const priceUGX = Math.round(editPrice * 3750);
      onUpdatePrice(item.id, priceUGX, priceUSD);
    }
    setEditingItemId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-[1700px] mx-auto p-4 md:p-6 gap-5">
      {/* Header and Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Inventory & Stock Management</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 bg-blue-950 text-blue-400 rounded-full border border-blue-800">
              {menu.length} SKUs
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Atomic thread-safe stock deduction and replenishment controls
          </p>
        </div>

        {/* Inventory KPI Badges */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Catalog Valuation:</span>
            <span className="text-emerald-400 font-mono font-bold tabular-nums">
              {formatCurrency(currency === 'UGX' ? totalValueUGX : totalValueUSD, currency)}
            </span>
          </div>

          {lowStockCount > 0 && (
            <div className="bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-lg flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{lowStockCount} Low Stock</span>
            </div>
          )}

          {outOfStockCount > 0 && (
            <div className="bg-rose-950/40 border border-rose-800/60 px-3 py-1.5 rounded-lg flex items-center gap-2 text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{outOfStockCount} Out of Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search SKU by dish name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.click();
                setCategoryFilter(cat);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table view */}
      <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl min-h-0 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 font-semibold">SKU & Item Name</th>
              <th className="py-3 px-3 font-semibold">Category</th>
              <th className="py-3 px-3 font-semibold text-right">Price ({currency})</th>
              <th className="py-3 px-4 font-semibold text-center">Stock Level</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Restock Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-normal">
            {filtered.map((item) => {
              const price = currency === 'UGX' ? item.priceUGX : item.priceUSD;
              const isLow = item.stockQuantity > 0 && item.stockQuantity <= 10;
              const isOut = item.stockQuantity === 0;

              return (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{item.description}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">{item.category}</td>
                  <td className="py-3.5 px-3 text-right">
                    {editingItemId === item.id ? (
                      <div className="inline-flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-20 bg-slate-950 border border-blue-500 rounded px-1.5 py-0.5 text-right font-mono text-xs text-white"
                        />
                        <button
                          onClick={() => handleSavePrice(item)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleStartEdit(item)}
                        className="font-mono font-bold text-slate-200 tabular-nums cursor-pointer hover:text-blue-400 transition-colors"
                        title="Click to edit price"
                      >
                        {formatCurrency(price, currency)}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono font-bold text-sm tabular-nums text-white">
                        {item.stockQuantity}
                      </span>
                      <span className="text-[10px] text-slate-500">/ {item.initialStock}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {isOut ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-950 text-rose-400 border border-rose-800">
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Healthy
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          sound.addItem();
                          onRestock(item.id, 10);
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors"
                        title="Add 10 units"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => {
                          sound.addItem();
                          onRestock(item.id, 50);
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors"
                        title="Add 50 units"
                      >
                        +50
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
