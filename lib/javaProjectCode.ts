export interface JavaFileEntry {
  filename: string;
  packagePath: string;
  description: string;
  code: string;
}

export const ACADEMIC_PROJECT_INFO = {
  course: 'CSC 1102: Structured and Object-Oriented Programming',
  projectTitle: 'Practical Exam Project — Restaurant Ordering System (Interactive & Production POS Edition)',
  groupName: 'Group 3',
  session: 'Afternoon Session',
  institution: 'Makerere University / Faculty of Computing and Informatics Technology',
  members: [
    { name: 'NABASUMBA GLORIA PATIENCE', regNo: '26/U/03586/PSA', role: 'UI/UX & Custom Components Engineer' },
    { name: 'KWIZERA SAMUEL', regNo: '26/X/26531/PSA', role: 'System Architect & Domain Service Engineer' },
    { name: 'OKELLO SAMUEL', regNo: '26/U/31009/EVE', role: 'Data Layer & Thread-Safe Concurrency' },
    { name: 'LUYIMA HENRY BRIAN', regNo: '26/U/30094/PS', role: 'Billing, VAT & Fiscal Receipt Engine' },
    { name: 'LUMU DESIRE BLESSING', regNo: '26/U/03556/PSA', role: 'Menu Catalog & State Machine Logic' },
  ],
};

export const JAVA_PROJECT_FILES: JavaFileEntry[] = [
  {
    filename: 'Main.java',
    packagePath: 'com.group3.restaurant.Main',
    description: 'Application bootstrap, look & feel initializer, and dependency injection wiring.',
    code: `package com.group3.restaurant;

import com.group3.restaurant.repository.MenuRepository;
import com.group3.restaurant.repository.OrderRepository;
import com.group3.restaurant.service.BillingService;
import com.group3.restaurant.service.OrderService;
import com.group3.restaurant.ui.RestaurantPOSFrame;

import javax.swing.*;

/**
 * CSC 1102: Structured and Object-Oriented Programming - Practical Exam
 * Group 3: Afternoon Session
 */
public class Main {
    public static void main(String[] args) {
        // Enforce modern native look-and-feel
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {}

        // Clean Architecture: Instantiate Data Repositories
        MenuRepository menuRepository = new MenuRepository();
        OrderRepository orderRepository = new OrderRepository();

        // Business Logic & Services
        BillingService billingService = new BillingService();
        OrderService orderService = new OrderService(menuRepository, orderRepository);

        // Safe launch on Event Dispatch Thread (EDT)
        SwingUtilities.invokeLater(() -> {
            RestaurantPOSFrame app = new RestaurantPOSFrame(orderService, billingService);
            app.setVisible(true);
        });
    }
}`,
  },
  {
    filename: 'CurrencyConfig.java',
    packagePath: 'com.group3.restaurant.model.CurrencyConfig',
    description: 'Precision financial formatting using BigDecimal avoiding floating point IEEE 754 bugs.',
    code: `package com.group3.restaurant.model;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public final class CurrencyConfig {
    private static final Locale APP_LOCALE = new Locale("en", "UG");
    private static final String CURRENCY_SYMBOL = "UGX ";

    private CurrencyConfig() {}

    public static String format(BigDecimal amount) {
        if (amount == null) amount = BigDecimal.ZERO;
        NumberFormat nf = NumberFormat.getNumberInstance(APP_LOCALE);
        nf.setMinimumFractionDigits(0);
        nf.setMaximumFractionDigits(2);
        return CURRENCY_SYMBOL + nf.format(amount);
    }
}`,
  },
  {
    filename: 'MenuItem.java',
    packagePath: 'com.group3.restaurant.model.MenuItem',
    description: 'Thread-safe inventory-aware domain model for food and drink catalog items.',
    code: `package com.group3.restaurant.model;

import java.math.BigDecimal;
import java.util.Objects;

public class MenuItem {
    private final int id;
    private final String name;
    private final String category;
    private final BigDecimal price;
    private int stockQuantity;

    public MenuItem(int id, String name, String category, BigDecimal price, int stockQuantity) {
        this.id = id;
        this.name = Objects.requireNonNull(name, "Name required");
        this.category = Objects.requireNonNull(category, "Category required");
        this.price = Objects.requireNonNull(price, "Price required");
        this.stockQuantity = stockQuantity;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public BigDecimal getPrice() { return price; }
    public synchronized int getStockQuantity() { return stockQuantity; }

    public synchronized boolean deductStock(int qty) {
        if (this.stockQuantity >= qty) {
            this.stockQuantity -= qty;
            return true;
        }
        return false;
    }

    public synchronized void replenishStock(int qty) {
        this.stockQuantity += qty;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MenuItem)) return false;
        MenuItem menuItem = (MenuItem) o;
        return id == menuItem.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return name + " (" + CurrencyConfig.format(price) + ")";
    }
}`,
  },
  {
    filename: 'Order.java',
    packagePath: 'com.group3.restaurant.model.Order',
    description: 'Aggregate root representing a dining session with line items and financial tax logic.',
    code: `package com.group3.restaurant.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Order {
    private final int orderId;
    private final int tableNumber;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private final LocalDateTime createdAt;
    private final List<OrderItem> items = new ArrayList<>();

    public Order(int orderId, int tableNumber) {
        this.orderId = orderId;
        this.tableNumber = tableNumber;
        this.status = OrderStatus.OPEN;
        this.createdAt = LocalDateTime.now();
    }

    public int getOrderId() { return orderId; }
    public int getTableNumber() { return tableNumber; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod method) { this.paymentMethod = method; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public synchronized List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public synchronized void addItem(MenuItem item, int quantity) {
        for (OrderItem oi : items) {
            if (oi.getItem().equals(item)) {
                oi.addQuantity(quantity);
                return;
            }
        }
        items.add(new OrderItem(item, quantity));
    }

    public synchronized OrderItem removeItem(int index) {
        if (index >= 0 && index < items.size()) {
            return items.remove(index);
        }
        return null;
    }

    public synchronized BigDecimal getSubtotal() {
        BigDecimal sum = BigDecimal.ZERO;
        for (OrderItem item : items) {
            sum = sum.add(item.getSubtotal());
        }
        return sum;
    }

    public synchronized BigDecimal getTaxAmount(double taxRate) {
        return getSubtotal().multiply(BigDecimal.valueOf(taxRate));
    }

    public synchronized BigDecimal getTotal(double taxRate) {
        return getSubtotal().add(getTaxAmount(taxRate));
    }

    @Override
    public String toString() {
        return "Order #" + orderId + " (Table " + tableNumber + ")";
    }
}`,
  },
  {
    filename: 'BillingService.java',
    packagePath: 'com.group3.restaurant.service.BillingService',
    description: 'Fiscal receipt formatting with 18% Uganda VAT calculation and disk persistence.',
    code: `package com.group3.restaurant.service;

import com.group3.restaurant.model.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;

public class BillingService {
    public static final double VAT_RATE = 0.18; // 18% standard Uganda VAT

    public String generateReceipt(Order order) {
        StringBuilder b = new StringBuilder();
        b.append("====================================================\\n");
        b.append("              GROUP 3 KAMPALA BISTRO                \\n");
        b.append("         Plot 12 Makerere Road, Kampala, UG         \\n");
        b.append("                  TIN: 1002938472                   \\n");
        b.append("====================================================\\n");
        b.append(String.format("Receipt No : REC-%06d\\n", order.getOrderId()));
        b.append(String.format("Table No   : %-10d\\n", order.getTableNumber()));
        b.append(String.format("Date       : %s\\n",
                order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
        b.append(String.format("Method     : %s\\n",
                order.getPaymentMethod() != null ? order.getPaymentMethod() : "PENDING"));
        b.append("----------------------------------------------------\\n");
        b.append(String.format("%-22s %5s %10s %10s\\n", "Description", "Qty", "Price", "Amount"));
        b.append("----------------------------------------------------\\n");

        for (OrderItem oi : order.getItems()) {
            b.append(String.format("%-22.22s %5d %10s %10s\\n",
                    oi.getItem().getName(),
                    oi.getQuantity(),
                    CurrencyConfig.format(oi.getUnitPrice()).replace("UGX ", ""),
                    CurrencyConfig.format(oi.getSubtotal()).replace("UGX ", "")));
        }

        b.append("----------------------------------------------------\\n");
        b.append(String.format("Subtotal:                           %16s\\n", CurrencyConfig.format(order.getSubtotal())));
        b.append(String.format("VAT (18%% included):                 %16s\\n", CurrencyConfig.format(order.getTaxAmount(VAT_RATE))));
        b.append("----------------------------------------------------\\n");
        b.append(String.format("TOTAL PAYABLE:                      %16s\\n", CurrencyConfig.format(order.getTotal(VAT_RATE))));
        b.append("====================================================\\n");
        b.append("         Thank you for dining with us!              \\n");
        b.append("====================================================\\n");
        return b.toString();
    }

    public void saveReceiptToFile(Order order) throws IOException {
        String receipt = generateReceipt(order);
        Path path = Paths.get("Receipt_Order_" + order.getOrderId() + ".txt");
        Files.write(path, receipt.getBytes(StandardCharsets.UTF_8));
    }
}`,
  },
  {
    filename: 'OrderService.java',
    packagePath: 'com.group3.restaurant.service.OrderService',
    description: 'Transactional business service orchestrating table orders, stock limits, and sales tracking.',
    code: `package com.group3.restaurant.service;

import com.group3.restaurant.model.*;
import com.group3.restaurant.repository.MenuRepository;
import com.group3.restaurant.repository.OrderRepository;

import java.math.BigDecimal;
import java.util.List;

public class OrderService {
    private final MenuRepository menuRepository;
    private final OrderRepository orderRepository;

    public OrderService(MenuRepository menuRepository, OrderRepository orderRepository) {
        this.menuRepository = menuRepository;
        this.orderRepository = orderRepository;
    }

    public Order startNewOrder(int tableNumber) {
        return orderRepository.create(tableNumber);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<MenuItem> getCatalog() {
        return menuRepository.findAll();
    }

    public synchronized void addItemToOrder(Order order, MenuItem item, int quantity) throws IllegalStateException {
        if (order.getStatus() != OrderStatus.OPEN) {
            throw new IllegalStateException("Order is " + order.getStatus() + " and cannot be modified.");
        }
        if (!item.deductStock(quantity)) {
            throw new IllegalStateException("Insufficient stock! Available: " + item.getStockQuantity());
        }
        order.addItem(item, quantity);
    }

    public synchronized void removeItemFromOrder(Order order, int index) {
        if (order.getStatus() != OrderStatus.OPEN) {
            throw new IllegalStateException("Order cannot be modified.");
        }
        OrderItem removed = order.removeItem(index);
        if (removed != null) {
            removed.getItem().replenishStock(removed.getQuantity());
        }
    }

    public void serveOrder(Order order) {
        if (order.getStatus() != OrderStatus.OPEN) {
            throw new IllegalStateException("Only open orders can be marked served.");
        }
        order.setStatus(OrderStatus.SERVED);
    }

    public void processPayment(Order order, PaymentMethod method) {
        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalStateException("Order has already been settled.");
        }
        if (order.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot settle an empty order.");
        }
        order.setPaymentMethod(method);
        order.setStatus(OrderStatus.PAID);
    }

    public BigDecimal computeDailyTotalRevenue() {
        return orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == OrderStatus.PAID)
                .map(o -> o.getTotal(BillingService.VAT_RATE))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}`,
  },
];
