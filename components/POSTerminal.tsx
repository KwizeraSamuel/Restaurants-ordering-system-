'use client';

import React from 'react';
import { MenuItem, Order, OrderItem, Currency } from '@/types/restaurant';
import { formatCurrency, VAT_RATE } from '@/lib/initialData';
import { AnimatedTotal } from './AnimatedTotal';
import { sound } from '@/lib/sound';
import {
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  CreditCard,
  Printer,
  Utensils,
  AlertCircle,
  Flame,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface POSTerminalProps {
  menu: MenuItem[];
  orders: Order[];
  activeOrder: Order | null;
  currency: Currency;
  tableNumber: number;
  setTableNumber: (table: number) => void;
  onSelectOrder: (order: Order | null) => void;
  onNewOrder: (tableNum: number) => void;
  onAddItem: (item: MenuItem, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onMarkServed: () => void;
  onOpenPaymentModal: () => void;
  onOpenReceiptModal: () => void;
  flashingIndex: number | null;
}

export function POSTerminal({
  menu,
  orders,
  activeOrder,
  currency,
  tableNumber,
  setTableNumber,
  onSelectOrder,
  onNewOrder,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onMarkServed,
  onOpenPaymentModal,
  onOpenReceiptModal,
  flashingIndex,
}: POSTerminalProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<MenuItem | null>(null);
  const [quantity, setQuantity] = React.useState<number>(1);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const categories = ['All', 'Breakfast', 'Mains', 'Specials', 'Sides', 'Beverages', 'Desserts'];

  // Filtered menu
  const filteredMenu = React.useMemo(() => {
    return menu.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [menu, selectedCategory, searchQuery]);

  // Highlight search term helper
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-400 text-slate-950 px-0.5 rounded-xs font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleAddSelected = (itemToAdd?: MenuItem) => {
    const target = itemToAdd || selectedMenuItem;
    if (!activeOrder) {
      sound.beep();
      return;
    }
    if (activeOrder.status !== 'OPEN') {
      sound.beep();
      return;
    }
    if (!target) {
      sound.beep();
      return;
    }
    if (target.stockQuantity < quantity) {
      sound.beep();
      return;
    }

    onAddItem(target, quantity);
    sound.addItem();
    setQuantity(1);
  };

  const isOpen = activeOrder?.status === 'OPEN';
  const hasItems = (activeOrder?.items.length ?? 0) > 0;
  const isServed = activeOrder?.status === 'SERVED';
  const isPaid = activeOrder?.status === 'PAID';

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-[1700px] mx-auto p-4 md:p-6 gap-4">
      {/* Top Controls Strip: Table Spinner, Active Order Dropdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="table-select" className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Table:
          </label>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
            <button
              onClick={() => {
                if (tableNumber > 1) {
                  sound.click();
                  setTableNumber(tableNumber - 1);
                }
              }}
              className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Decrease table number"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-10 text-center font-mono font-bold text-white text-sm tabular-nums">
              {tableNumber}
            </span>
            <button
              onClick={() => {
                if (tableNumber < 50) {
                  sound.click();
                  setTableNumber(tableNumber + 1);
                }
              }}
              className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Increase table number"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => {
              sound.click();
              onNewOrder(tableNumber);
            }}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-xs"
          >
            + Start Table Order
          </button>
        </div>

        {/* Active Order Selector */}
        <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
          <label htmlFor="order-selector" className="text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Active Order:
          </label>
          <select
            id="order-selector"
            value={activeOrder?.id || ''}
            onChange={(e) => {
              sound.click();
              const found = orders.find((o) => o.id === Number(e.target.value));
              onSelectOrder(found || null);
            }}
            className="bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-blue-500 flex-1 max-w-xs"
          >
            <option value="">-- No Order Selected --</option>
            {orders.map((o) => {
              const totalStr = formatCurrency(currency === 'UGX' ? o.totalUGX : o.totalUSD, currency);
              return (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} (Table {o.tableNumber}) — [{o.status}] {totalStr}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Main Split Grid: Left Menu catalog | Right Order details & Totals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-hidden">
        {/* Left Column (Menu Catalog) - 7 cols */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                Food & Drinks Menu
              </h2>
              <span className="text-xs text-slate-400">
                {filteredMenu.length} item{filteredMenu.length === 1 ? '' : 's'} available
              </span>
            </div>

            {/* Filter pills & search input */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search menu items or ingredients (Ctrl+F)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Segmented Controls */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sound.click();
                      setSelectedCategory(cat);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-0">
            {filteredMenu.map((item) => {
              const isSelected = selectedMenuItem?.id === item.id;
              const isOutOfStock = item.stockQuantity <= 0;
              const price = currency === 'UGX' ? item.priceUGX : item.priceUSD;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.click();
                    setSelectedMenuItem(item);
                  }}
                  onDoubleClick={() => handleAddSelected(item)}
                  className={`relative flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/20 shadow-xs'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950'
                  } ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                        {renderHighlightedText(item.name, searchQuery)}
                        {item.isPopular && (
                          <span title="Popular Item" className="text-amber-400">
                            <Flame className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-sm text-blue-400 whitespace-nowrap tabular-nums">
                        {formatCurrency(price, currency)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {renderHighlightedText(item.description, searchQuery)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-500">
                      {item.category} •{' '}
                      <span
                        className={`font-mono font-medium ${
                          item.stockQuantity <= 5
                            ? 'text-rose-400'
                            : item.stockQuantity <= 15
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        Stock: {item.stockQuantity}
                      </span>
                    </span>

                    <button
                      disabled={isOutOfStock || !isOpen}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddSelected(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 rounded-md hover:bg-emerald-900/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title={!isOpen ? 'Active order must be OPEN' : 'Add 1 to order'}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredMenu.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500">
                <Utensils className="w-10 h-10 mb-3 opacity-40 text-slate-400" />
                <p className="text-sm font-medium">No menu items match your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-3 text-xs text-blue-400 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Quick Add Bar */}
          <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Quantity:</span>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => {
                    if (quantity > 1) {
                      sound.click();
                      setQuantity(quantity - 1);
                    }
                  }}
                  className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-white text-xs tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    if (quantity < 99) {
                      sound.click();
                      setQuantity(quantity + 1);
                    }
                  }}
                  className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {selectedMenuItem && (
                <span className="text-xs text-slate-300 truncate max-w-xs hidden sm:inline">
                  Selected: <strong className="text-white">{selectedMenuItem.name}</strong>
                </span>
              )}
            </div>

            <button
              disabled={!isOpen || !selectedMenuItem || (selectedMenuItem?.stockQuantity ?? 0) < quantity}
              onClick={() => handleAddSelected()}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Add to Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (Order Details & Billing) - 5 cols */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          {/* Order Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            {activeOrder ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-blue-400 text-xs">
                  T{activeOrder.tableNumber}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Order {activeOrder.orderNumber}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        activeOrder.status === 'OPEN'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : activeOrder.status === 'SERVED'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : activeOrder.status === 'PAID'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {activeOrder.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Server: {activeOrder.serverName} • Table {activeOrder.tableNumber}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm font-semibold text-slate-400">No active order</div>
            )}

            {activeOrder && (
              <div className="text-right text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono">
                  {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          {/* Items Table View */}
          <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-slate-800/60">
            {activeOrder && activeOrder.items.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 sticky top-0 z-10 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Item</th>
                    <th className="py-2.5 px-2 font-medium text-right">Price</th>
                    <th className="py-2.5 px-3 font-medium text-center">Qty</th>
                    <th className="py-2.5 px-3 font-medium text-right">Subtotal</th>
                    <th className="py-2.5 px-2 font-medium text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-normal">
                  {activeOrder.items.map((item, idx) => {
                    const price = currency === 'UGX' ? item.unitPriceUGX : item.unitPriceUSD;
                    const subtotal = currency === 'UGX' ? item.subtotalUGX : item.subtotalUSD;
                    const isFlashing = flashingIndex === idx;

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-slate-800/40 ${
                          isFlashing ? 'bg-amber-400/20 text-white' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-slate-100 font-medium">
                          <div>{item.name}</div>
                          {item.notes && <div className="text-[11px] text-slate-400">{item.notes}</div>}
                        </td>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-300">
                          {formatCurrency(price, currency)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5">
                            {isOpen && (
                              <button
                                onClick={() => {
                                  sound.click();
                                  onUpdateQuantity(idx, item.quantity - 1);
                                }}
                                className="text-slate-400 hover:text-white"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                            )}
                            <span className="w-5 text-center font-mono font-semibold text-white">
                              {item.quantity}
                            </span>
                            {isOpen && (
                              <button
                                onClick={() => {
                                  sound.click();
                                  onUpdateQuantity(idx, item.quantity + 1);
                                }}
                                className="text-slate-400 hover:text-white"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-400 tabular-nums">
                          {formatCurrency(subtotal, currency)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {isOpen && (
                            <button
                              onClick={() => {
                                sound.click();
                                onRemoveItem(idx);
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <AlertCircle className="w-10 h-10 mb-3 opacity-30 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-300">
                  {activeOrder ? 'Order has no items yet' : 'No order selected'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  {activeOrder
                    ? 'Click on any item on the left menu to add dishes to this table.'
                    : 'Select an active order from the top bar or choose a table and click + Start Table Order (Ctrl+N).'}
                </p>
                {!activeOrder && (
                  <button
                    onClick={() => onNewOrder(tableNumber)}
                    className="mt-4 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    + Open Table {tableNumber} Order
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer Totals & Action Buttons */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
            <AnimatedTotal
              total={currency === 'UGX' ? activeOrder?.totalUGX || 0 : activeOrder?.totalUSD || 0}
              subtotal={currency === 'UGX' ? activeOrder?.subtotalUGX || 0 : activeOrder?.subtotalUSD || 0}
              tax={currency === 'UGX' ? activeOrder?.taxUGX || 0 : activeOrder?.taxUSD || 0}
              currency={currency}
            />

            {/* Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                disabled={!isOpen || !hasItems}
                onClick={onMarkServed}
                className="px-3 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                title="Mark order as served"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark Served</span>
              </button>

              <button
                disabled={!activeOrder || isPaid || !hasItems}
                onClick={onOpenPaymentModal}
                className="px-3 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                title="Take customer payment"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payment</span>
              </button>

              <button
                disabled={!activeOrder || !hasItems}
                onClick={onOpenReceiptModal}
                className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/40 disabled:text-slate-600 text-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                title="Print fiscal receipt (Ctrl+P)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>

              <button
                disabled={!activeOrder || isPaid}
                onClick={() => {
                  if (activeOrder && confirm(`Are you sure you want to cancel Order ${activeOrder.orderNumber}?`)) {
                    // Handled in parent
                    sound.click();
                  }
                }}
                className="px-3 py-2 text-xs font-medium bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 disabled:border-slate-800 disabled:bg-slate-800/40 disabled:text-slate-600 text-rose-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                title="Cancel this order"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
