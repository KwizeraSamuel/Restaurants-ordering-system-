'use client';

import React from 'react';
import { MenuItem, Order, OrderStatus, TableInfo, Currency, PaymentMethod, ToastMessage } from '@/types/restaurant';
import { INITIAL_MENU, INITIAL_ORDERS, INITIAL_TABLES, VAT_RATE, formatCurrency } from '@/lib/initialData';
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

export default function RestaurantOrderingSystemApp() {
  // Model state
  const [menu, setMenu] = React.useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS);
  const [tables, setTables] = React.useState<TableInfo[]>(INITIAL_TABLES);
  const [activeOrderId, setActiveOrderId] = React.useState<number | null>(1001);

  // Settings & UX state
  const [currency, setCurrency] = React.useState<Currency>('UGX');
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(true);
  const [tableNumber, setTableNumber] = React.useState<number>(1);
  const [activeView, setActiveView] = React.useState<'pos' | 'kds' | 'floor' | 'inventory' | 'analytics' | 'java'>('pos');
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

  // Recalculate order totals helper
  const recalculateOrder = (order: Order): Order => {
    let subUGX = 0;
    let subUSD = 0;
    order.items.forEach((item) => {
      subUGX += item.subtotalUGX;
      subUSD += item.subtotalUSD;
    });

    const taxUGX = Math.round(subUGX * VAT_RATE);
    const taxUSD = Number((subUSD * VAT_RATE).toFixed(2));
    const totalUGX = subUGX + taxUGX;
    const totalUSD = Number((subUSD + taxUSD).toFixed(2));

    return {
      ...order,
      subtotalUGX: subUGX,
      subtotalUSD: subUSD,
      taxUGX,
      taxUSD,
      totalUGX,
      totalUSD,
      updatedAt: new Date().toISOString(),
    };
  };

  // Business Action: New Order
  const handleNewOrder = React.useCallback(
    (tableNum: number) => {
      setOrders((prev) => {
        const nextId = prev.length > 0 ? Math.max(...prev.map((o) => o.id)) + 1 : 1001;
        const servers = ['Samuel Kwizera', 'Gloria Patience', 'Henry Brian Luyima', 'Samuel Okello', 'Desire Blessing'];
        const randomServer = servers[nextId % servers.length];

        const newOrd: Order = {
          id: nextId,
          orderNumber: `#${nextId}`,
          tableNumber: tableNum,
          status: 'OPEN',
          serverName: randomServer,
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

        setActiveOrderId(nextId);
        return [...prev, newOrd];
      });

      // Update Table status
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableNum ? { ...t, status: 'OCCUPIED' } : t
        )
      );

      sound.click();
      addToast(`Created Order for Table ${tableNum}`, 'SUCCESS');
      setActiveView('pos');
    },
    [addToast]
  );

  // Business Action: Add Item to Order with Atomic Stock Deduction
  const handleAddItem = (item: MenuItem, qty: number) => {
    if (!activeOrder) {
      sound.beep();
      addToast('Please select or create an active order first.', 'WARNING');
      return;
    }
    if (activeOrder.status !== 'OPEN') {
      sound.beep();
      addToast(`Cannot modify an order that is ${activeOrder.status}`, 'ERROR');
      return;
    }
    if (item.stockQuantity < qty) {
      sound.beep();
      addToast(`Insufficient stock for ${item.name}! (Only ${item.stockQuantity} left)`, 'ERROR');
      return;
    }

    // Deduct stock in catalog
    setMenu((prev) =>
      prev.map((m) =>
        m.id === item.id ? { ...m, stockQuantity: m.stockQuantity - qty } : m
      )
    );

    // Update order items
    let updatedItems = [...activeOrder.items];
    const existingIndex = updatedItems.findIndex((oi) => oi.menuItemId === item.id);
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
      };
      updatedItems.push(newItem);
      targetIndex = updatedItems.length - 1;
    }

    const updatedOrder = recalculateOrder({
      ...activeOrder,
      items: updatedItems,
    });

    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));

    // Trigger row flash
    setFlashingIndex(targetIndex);
    setTimeout(() => setFlashingIndex(null), 450);

    addToast(`Added ${qty}× ${item.name}`, 'SUCCESS');
  };

  // Business Action: Remove Item & Replenish Stock
  const handleRemoveItem = (index: number) => {
    if (!activeOrder || activeOrder.status !== 'OPEN') {
      sound.beep();
      return;
    }

    const target = activeOrder.items[index];
    if (!target) return;

    // Replenish stock in catalog
    setMenu((prev) =>
      prev.map((m) =>
        m.id === target.menuItemId ? { ...m, stockQuantity: m.stockQuantity + target.quantity } : m
      )
    );

    const updatedItems = activeOrder.items.filter((_, i) => i !== index);
    const updatedOrder = recalculateOrder({
      ...activeOrder,
      items: updatedItems,
    });

    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    addToast(`Removed ${target.name}`, 'INFO');
  };

  // Business Action: Update Item Quantity
  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (!activeOrder || activeOrder.status !== 'OPEN') return;
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
          m.id === target.menuItemId ? { ...m, stockQuantity: m.stockQuantity - diff } : m
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

    const updatedOrder = recalculateOrder({
      ...activeOrder,
      items: updatedItems,
    });

    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
  };

  // Business Action: Mark as Served
  const handleMarkServed = () => {
    if (!activeOrder || activeOrder.status !== 'OPEN') {
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
      prev.map((t) => (t.id === activeOrder.tableNumber ? { ...t, status: 'SERVED' } : t))
    );
    addToast(`Order ${activeOrder.orderNumber} marked as SERVED.`, 'WARNING');
  };

  // Business Action: Settle Bill & Take Payment
  const handleConfirmPayment = (method: PaymentMethod, details: any) => {
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
        t.id === activeOrder.tableNumber ? { ...t, status: 'FREE', activeOrderId: undefined } : t
      )
    );

    setPaymentModalOpen(false);
    setReceiptModalOpen(true);
    addToast(`Payment received for Order ${activeOrder.orderNumber} via ${method}. Thank you!`, 'SUCCESS');
  };

  // Restock helper for Inventory Manager
  const handleRestock = (itemId: number, amount: number) => {
    setMenu((prev) =>
      prev.map((m) =>
        m.id === itemId
          ? { ...m, stockQuantity: m.stockQuantity + amount, initialStock: m.initialStock + amount }
          : m
      )
    );
    const item = menu.find((m) => m.id === itemId);
    addToast(`Restocked +${amount} units for ${item?.name || 'item'}`, 'SUCCESS');
  };

  // Price adjustment helper
  const handleUpdatePrice = (itemId: number, priceUGX: number, priceUSD: number) => {
    setMenu((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, priceUGX, priceUSD } : m))
    );
    addToast('Menu price updated.', 'SUCCESS');
  };

  // Global Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + N or Cmd + N
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewOrder(tableNumber);
      }
      // Ctrl + P or Cmd + P
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (activeOrder && activeOrder.items.length > 0) {
          setReceiptModalOpen(true);
        }
      }
      // Esc
      else if (e.key === 'Escape') {
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
      .reduce((sum, o) => (currency === 'UGX' ? sum + o.totalUGX : sum + o.totalUSD), 0);
    return formatCurrency(total, currency);
  }, [orders, currency]);

  const activeOrderCount = React.useMemo(() => {
    return orders.filter((o) => o.status === 'OPEN' || o.status === 'SERVED').length;
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
            onMarkServed={handleMarkServed}
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
                prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
              );
              const found = orders.find((o) => o.id === orderId);
              if (found) {
                setTables((prev) =>
                  prev.map((t) => (t.id === found.tableNumber ? { ...t, status: 'SERVED' } : t))
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
