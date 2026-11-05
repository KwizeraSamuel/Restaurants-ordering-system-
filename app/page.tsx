'use client';

import React from 'react';
import {
  MenuItem,
  Order,
  TableInfo,
  Currency,
  PaymentMethod,
  PaymentDetails,
  ToastMessage,
} from '@/types/restaurant';
import {
  INITIAL_MENU,
  INITIAL_ORDERS,
  INITIAL_TABLES,
  formatCurrency,
} from '@/lib/initialData';
import { recalculateOrderTotals } from '@/lib/orderLogic';
import { sound } from '@/lib/sound';
import { TopNavigation } from '@/components/TopNavigation';
import { POSTerminal } from '@/components/POSTerminal';
import { KitchenDisplay } from '@/components/KitchenDisplay';
import { FloorPlan } from '@/components/FloorPlan';
import { InventoryManager } from '@/components/InventoryManager';
import { ShiftAnalytics } from '@/components/ShiftAnalytics';
import { PaymentModal } from '@/components/PaymentModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { JavaCodeModal } from '@/components/JavaCodeModal';
import { ToastContainer } from '@/components/ToastContainer';

const STORAGE_KEY = 'kampala_bistro_pos_state_v1';

export default function RestaurantOrderingSystemApp() {
  // Model state
  const [menu, setMenu] = React.useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS);
  const [tables, setTables] = React.useState<TableInfo[]>(INITIAL_TABLES);
  const [activeOrderId, setActiveOrderId] = React.useState<number | null>(1001);
  const [hydrated, setHydrated] = React.useState<boolean>(false);

  // Settings & UX state
  const [currency, setCurrency] = React.useState<Currency>('UGX');
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(true);
  const [tableNumber, setTableNumber] = React.useState<number>(1);
  const [activeView, setActiveView] = React.useState<
    'pos' | 'kds' | 'floor' | 'inventory' | 'analytics' | 'java'
  >('pos');
  const [flashingIndex, setFlashingIndex] = React.useState<number | null>(null);

  // Modals state
  const [paymentModalOpen, setPaymentModalOpen] = React.useState<boolean>(false);
  const [receiptModalOpen, setReceiptModalOpen] = React.useState<boolean>(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = React.useState<boolean>(false);
  const [javaModalOpen, setJavaModalOpen] = React.useState<boolean>(false);

  // Toast notifications pre-seeded with welcome toast
  const [toasts, setToasts] = React.useState<ToastMessage[]>([
    {
      id: 'welcome-init',
      text: 'Welcome to Kampala Bistro POS! Press Ctrl+N to open a table order.',
      kind: 'INFO',
      timestamp: 0,
    },
  ]);

  // Load persisted state on client mount
  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.menu) && parsed.menu.length > 0) setMenu(parsed.menu);
        if (Array.isArray(parsed.orders) && parsed.orders.length > 0) setOrders(parsed.orders);
        if (Array.isArray(parsed.tables) && parsed.tables.length > 0) setTables(parsed.tables);
        if (typeof parsed.activeOrderId === 'number') setActiveOrderId(parsed.activeOrderId);
      }
    } catch {
      // Ignore corrupt storage
    } finally {
      setHydrated(true);
    }
    const welcomeTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== 'welcome-init'));
    }, 3500);
    return () => clearTimeout(welcomeTimer);
  }, []);

  // Persist state changes after hydration
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ menu, orders, tables, activeOrderId })
      );
    } catch {
      // Ignore quota errors
    }
  }, [menu, orders, tables, activeOrderId, hydrated]);

  const addToast = React.useCallback((text: string, kind: ToastMessage['kind']) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, kind, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeOrder = React.useMemo(() => {
    return orders.find((o) => o.id === activeOrderId) || null;
  }, [orders, activeOrderId]);

  const handleResetDemo = () => {
    sound.click();
    setMenu(INITIAL_MENU);
    setOrders(INITIAL_ORDERS);
    setTables(INITIAL_TABLES);
    setActiveOrderId(1001);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    addToast('Demo data reset to initial CSC 1102 exam state.', 'INFO');
  };

  // Business Action: New Order
  const handleNewOrder = React.useCallback(
    (tableNum: number) => {
      const nextId =
        orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1001;
      const servers = [
        'Samuel Kwizera',
        'Gloria Patience',
        'Henry Brian Luyima',
        'Samuel Okello',
        'Desire Blessing',
      ];
      const assignedServer = servers[nextId % servers.length];

      const newOrd: Order = {
        id: nextId,
        orderNumber: `#${nextId}`,
        tableNumber: tableNum,
        status: 'OPEN',
        serverName: assignedServer,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtotalUGX: 0,
        subtotalUSD: 0,
        taxUGX: 0,
        taxUSD: 0,
        totalUGX: 0,
        totalUSD: 0,
      };

      setOrders((prev) => [...prev, newOrd]);
      setActiveOrderId(nextId);

      // Update Table status and link activeOrderId
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableNum ? { ...t, status: 'OCCUPIED', activeOrderId: nextId } : t
        )
      );

      sound.click();
      addToast(`Created Order #${nextId} for Table ${tableNum}`, 'SUCCESS');
      setActiveView('pos');
    },
    [orders, addToast]
  );

  // Business Action: Add Item to Order with Atomic Stock Deduction
  const handleAddItem = (item: MenuItem, qty: number, notes?: string) => {
    if (!activeOrder) {
      sound.beep();
      addToast('Please select or create an active order first.', 'WARNING');
      return;
    }
    if (activeOrder.status !== 'OPEN' && activeOrder.status !== 'PREPARING') {
      sound.beep();
      addToast(`Cannot modify an order that is ${activeOrder.status}`, 'ERROR');
      return;
    }
    if (item.stockQuantity < qty) {
      sound.beep();
      addToast(
        `Insufficient stock for ${item.name}! (Only ${item.stockQuantity} left)`,
        'ERROR'
      );
      return;
    }

    // Deduct stock in catalog
    setMenu((prev) =>
      prev.map((m) =>
        m.id === item.id ? { ...m, stockQuantity: m.stockQuantity - qty } : m
      )
    );

    const normalizedNote = notes?.trim() || undefined;
    const updatedItems = [...activeOrder.items];
    const existingIndex = updatedItems.findIndex(
      (oi) => oi.menuItemId === item.id && (oi.notes || undefined) === normalizedNote
    );
    let targetIndex = existingIndex;

    if (existingIndex >= 0) {
      const existing = updatedItems[existingIndex];
      const newQty = existing.quantity + qty;
      updatedItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        subtotalUGX: existing.unitPriceUGX * newQty,
        subtotalUSD: Number((existing.unitPriceUSD * newQty).toFixed(2)),
      };
    } else {
      const newItem = {
        menuItemId: item.id,
        name: item.name,
        category: item.category,
        unitPriceUGX: item.priceUGX,
        unitPriceUSD: item.priceUSD,
        quantity: qty,
        subtotalUGX: item.priceUGX * qty,
        subtotalUSD: Number((item.priceUSD * qty).toFixed(2)),
        notes: normalizedNote,
      };
      updatedItems.push(newItem);
      targetIndex = updatedItems.length - 1;
    }

    const updatedOrder = recalculateOrderTotals({
      ...activeOrder,
      items: updatedItems,
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );

    // Trigger row flash
    setFlashingIndex(targetIndex);
    setTimeout(() => setFlashingIndex(null), 450);

    addToast(`Added ${qty}× ${item.name}`, 'SUCCESS');
  };

  // Business Action: Remove Item & Replenish Stock
  const handleRemoveItem = (index: number) => {
    if (
      !activeOrder ||
      (activeOrder.status !== 'OPEN' && activeOrder.status !== 'PREPARING')
    ) {
      sound.beep();
      return;
    }

    const target = activeOrder.items[index];
    if (!target) return;

    // Replenish stock in catalog
    setMenu((prev) =>
      prev.map((m) =>
        m.id === target.menuItemId
          ? { ...m, stockQuantity: m.stockQuantity + target.quantity }
          : m
      )
    );

    const updatedItems = activeOrder.items.filter((_, i) => i !== index);
    const updatedOrder = recalculateOrderTotals({
      ...activeOrder,
      items: updatedItems,
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    addToast(`Removed ${target.name} and restored stock`, 'INFO');
  };

  // Business Action: Update Item Quantity
  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (
      !activeOrder ||
      (activeOrder.status !== 'OPEN' && activeOrder.status !== 'PREPARING')
    )
      return;
    const target = activeOrder.items[index];
    if (!target) return;

    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }

    const diff = newQty - target.quantity;
    const menuItem = menu.find((m) => m.id === target.menuItemId);

    if (diff > 0 && menuItem && menuItem.stockQuantity < diff) {
      sound.beep();
      addToast(`Only ${menuItem.stockQuantity} more available in stock!`, 'WARNING');
      return;
    }

    // Adjust catalog stock
    if (diff !== 0) {
      setMenu((prev) =>
        prev.map((m) =>
          m.id === target.menuItemId
            ? { ...m, stockQuantity: m.stockQuantity - diff }
            : m
        )
      );
    }

    const updatedItems = [...activeOrder.items];
    updatedItems[index] = {
      ...target,
      quantity: newQty,
      subtotalUGX: target.unitPriceUGX * newQty,
      subtotalUSD: Number((target.unitPriceUSD * newQty).toFixed(2)),
    };

    const updatedOrder = recalculateOrderTotals({
      ...activeOrder,
      items: updatedItems,
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  // Business Action: Apply Discount
  const handleApplyDiscount = (discountPercent: number) => {
    if (!activeOrder) return;
    const updatedOrder = recalculateOrderTotals({
      ...activeOrder,
      discountPercent,
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    addToast(
      discountPercent > 0
        ? `Applied ${discountPercent}% discount to Order ${activeOrder.orderNumber}`
        : `Cleared discount on Order ${activeOrder.orderNumber}`,
      'INFO'
    );
  };

  // Business Action: Send Order to Kitchen (PREPARING)
  const handleSendToKitchen = () => {
    if (!activeOrder || activeOrder.status !== 'OPEN') {
      sound.beep();
      return;
    }
    sound.click();

    const updated: Order = {
      ...activeOrder,
      status: 'PREPARING',
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    addToast(
      `Order ${activeOrder.orderNumber} routed to Kitchen Display (PREPARING).`,
      'INFO'
    );
  };

  // Business Action: Mark as Served
  const handleMarkServed = () => {
    if (
      !activeOrder ||
      (activeOrder.status !== 'OPEN' && activeOrder.status !== 'PREPARING')
    ) {
      sound.beep();
      return;
    }
    sound.click();

    const updated: Order = {
      ...activeOrder,
      status: 'SERVED',
      servedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeOrder.tableNumber ? { ...t, status: 'SERVED' } : t
      )
    );
    addToast(`Order ${activeOrder.orderNumber} marked as SERVED.`, 'WARNING');
  };

  // Business Action: Cancel Order & Replenish Stock
  const handleCancelOrder = () => {
    if (
      !activeOrder ||
      activeOrder.status === 'PAID' ||
      activeOrder.status === 'CANCELLED'
    ) {
      sound.beep();
      return;
    }
    sound.click();

    // Restore stock for all items in the cancelled order
    setMenu((prev) =>
      prev.map((m) => {
        const restoredQty = activeOrder.items
          .filter((oi) => oi.menuItemId === m.id)
          .reduce((sum, oi) => sum + oi.quantity, 0);
        return restoredQty > 0
          ? { ...m, stockQuantity: m.stockQuantity + restoredQty }
          : m;
      })
    );

    const updated: Order = {
      ...activeOrder,
      status: 'CANCELLED',
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeOrder.tableNumber
          ? { ...t, status: 'FREE', activeOrderId: undefined }
          : t
      )
    );
    addToast(
      `Cancelled Order ${activeOrder.orderNumber} and restored item stock.`,
      'WARNING'
    );
  };

  // Business Action: Settle Bill & Take Payment
  const handleConfirmPayment = (method: PaymentMethod, details: PaymentDetails) => {
    if (!activeOrder) return;

    const updated: Order = {
      ...activeOrder,
      status: 'PAID',
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentDetails: details,
    };

    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));

    // Free the table
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeOrder.tableNumber
          ? { ...t, status: 'FREE', activeOrderId: undefined }
          : t
      )
    );

    setPaymentModalOpen(false);
    setReceiptModalOpen(true);
    addToast(
      `Payment received for Order ${activeOrder.orderNumber} via ${method}. Thank you!`,
      'SUCCESS'
    );
  };

  // Restock helper for Inventory Manager
  const handleRestock = (itemId: number, amount: number) => {
    setMenu((prev) =>
      prev.map((m) =>
        m.id === itemId
          ? {
              ...m,
              stockQuantity: m.stockQuantity + amount,
              initialStock: Math.max(m.initialStock, m.stockQuantity + amount),
            }
          : m
      )
    );
    const item = menu.find((m) => m.id === itemId);
    addToast(`Restocked +${amount} units for ${item?.name || 'item'}`, 'SUCCESS');
  };

  // Price adjustment helper
  const handleUpdatePrice = (
    itemId: number,
    priceUGX: number,
    priceUSD: number
  ) => {
    setMenu((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, priceUGX, priceUSD } : m))
    );
    addToast('Menu price updated.', 'SUCCESS');
  };

  // Add new custom dish to catalog
  const handleAddMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    setMenu((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((m) => m.id)) + 1 : 1;
      return [...prev, { ...newItem, id: nextId }];
    });
    addToast(`Registered new dish "${newItem.name}" in catalog!`, 'SUCCESS');
  };

  // Global Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewOrder(tableNumber);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (activeOrder && activeOrder.items.length > 0) {
          setReceiptModalOpen(true);
        }
      } else if (e.key === 'Escape') {
        setPaymentModalOpen(false);
        setReceiptModalOpen(false);
        setShortcutsModalOpen(false);
        setJavaModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOrder, tableNumber, handleNewOrder]);

  // Compute Total Shift Sales
  const shiftRevenue = React.useMemo(() => {
    const total = orders
      .filter((o) => o.status === 'PAID')
      .reduce(
        (sum, o) => (currency === 'UGX' ? sum + o.totalUGX : sum + o.totalUSD),
        0
      );
    return formatCurrency(total, currency);
  }, [orders, currency]);

  const activeOrderCount = React.useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === 'OPEN' || o.status === 'PREPARING' || o.status === 'SERVED'
    ).length;
  }, [orders]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Universal Top Navigation & Secondary Workspace Toolbar */}
      <TopNavigation
        activeView={activeView}
        setActiveView={setActiveView}
        currency={currency}
        setCurrency={setCurrency}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        onOpenJavaModal={() => setJavaModalOpen(true)}
        onNewOrder={() => handleNewOrder(tableNumber)}
        onResetDemo={handleResetDemo}
        shiftRevenueFormatted={shiftRevenue}
        activeOrderCount={activeOrderCount}
      />

      {/* Main View Port */}
      <main className="flex-1 overflow-hidden">
        {activeView === 'pos' && (
          <POSTerminal
            menu={menu}
            orders={orders}
            activeOrder={activeOrder}
            currency={currency}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            onSelectOrder={(ord) => setActiveOrderId(ord ? ord.id : null)}
            onNewOrder={handleNewOrder}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onApplyDiscount={handleApplyDiscount}
            onSendToKitchen={handleSendToKitchen}
            onMarkServed={handleMarkServed}
            onCancelOrder={handleCancelOrder}
            onOpenPaymentModal={() => setPaymentModalOpen(true)}
            onOpenReceiptModal={() => setReceiptModalOpen(true)}
            flashingIndex={flashingIndex}
          />
        )}

        {activeView === 'kds' && (
          <KitchenDisplay
            orders={orders}
            onUpdateStatus={(orderId, nextStatus) => {
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === orderId ? { ...o, status: nextStatus } : o
                )
              );
              const found = orders.find((o) => o.id === orderId);
              if (found && nextStatus === 'SERVED') {
                setTables((prev) =>
                  prev.map((t) =>
                    t.id === found.tableNumber ? { ...t, status: 'SERVED' } : t
                  )
                );
              }
              addToast(`Order #${orderId} marked as ${nextStatus}`, 'SUCCESS');
            }}
            onSelectOrder={(order) => {
              setActiveOrderId(order.id);
              setActiveView('pos');
            }}
          />
        )}

        {activeView === 'floor' && (
          <FloorPlan
            tables={tables}
            orders={orders}
            currency={currency}
            onSelectTableOrder={(tblId, ordId) => {
              setTableNumber(tblId);
              if (ordId) {
                setActiveOrderId(ordId);
                setActiveView('pos');
              } else {
                handleNewOrder(tblId);
              }
            }}
          />
        )}

        {activeView === 'inventory' && (
          <InventoryManager
            menu={menu}
            currency={currency}
            onRestock={handleRestock}
            onUpdatePrice={handleUpdatePrice}
            onAddMenuItem={handleAddMenuItem}
          />
        )}

        {activeView === 'analytics' && (
          <ShiftAnalytics orders={orders} currency={currency} />
        )}
      </main>

      {/* Modals & Dialogs */}
      <PaymentModal
        order={activeOrder}
        currency={currency}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onConfirmPayment={handleConfirmPayment}
      />

      <ReceiptModal
        order={activeOrder}
        currency={currency}
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
      />

      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      <JavaCodeModal
        isOpen={javaModalOpen}
        onClose={() => setJavaModalOpen(false)}
      />

      {/* Animated Toasts Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
