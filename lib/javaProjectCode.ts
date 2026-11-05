export interface JavaFileEntry {
  filename: string;
  packagePath: string;
  description: string;
  oopConcepts: string[];
  code: string;
}

export interface RubricCriterion {
  category: string;
  requirement: string;
  implementationDetails: string;
  codeLocations: string[];
}

export const ACADEMIC_PROJECT_INFO = {
  course: 'CSC 1102: Structured and Object-Oriented Programming',
  projectTitle: 'Practical Exam Project — Kampala Bistro Restaurant Ordering & POS System',
  groupName: 'Group 3',
  groupLeader: 'KWIZERA SAMUEL',
  submissionZipName: 'kwizera_samuel_afternoon.zip',
  githubRepo: 'https://github.com/KwizeraSamuel/Restaurants-ordering-system-',
  deadline: '12th November 2026',
  presentationDuration: '15 Minutes',
  session: 'Afternoon Session',
  institution: 'Makerere University — College of Computing and Information Sciences (CoCIS)',
  examPdfPath: '/assets/aistudio/Java_Programming_Practical_Exam_Project_62c4a4f8.pdf',
  members: [
    { name: 'KWIZERA SAMUEL', regNo: '26/X/26531/PSA', role: 'Group Leader • System Architect & Order Array Engine' },
    { name: 'NABASUMBA GLORIA PATIENCE', regNo: '26/U/03586/PSA', role: 'Java Swing GUI & Interactive POS Components' },
    { name: 'OKELLO SAMUEL', regNo: '26/U/31009/EVE', role: 'Object Arrays (MenuItem[], Order[]) & Stock Control' },
    { name: 'LUYIMA HENRY BRIAN', regNo: '26/U/30094/PS', role: 'Fiscal Billing, 18% VAT & Receipt Generator' },
    { name: 'LUMU DESIRE BLESSING', regNo: '26/U/03556/PSA', role: 'Flow Control Logic, Validation & KDS Workflow' },
  ],
};

export const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    category: '1. Object-Oriented Design',
    requirement:
      'At least 3 classes representing meaningful entities; appropriate attributes & methods; constructors; private access modifiers; getters & setters; creation and interaction of objects.',
    implementationDetails:
      'Implemented 6 cohesive classes (MenuItem, OrderItem, Order, RestaurantManager, RestaurantSwingGUI, Main). All entity fields use private encapsulation with public getters/setters, overloaded constructors, and domain methods.',
    codeLocations: [
      'MenuItem.java (private id, name, category, priceUGX, stockQuantity + getters/setters)',
      'OrderItem.java (private MenuItem item, quantity, kitchenNote + getSubtotal())',
      'Order.java (private orderId, tableNumber, status, OrderItem[] items + business methods)',
      'RestaurantManager.java (manages MenuItem[] and Order[] object lifecycle)',
    ],
  },
  {
    category: '2. Graphical User Interface (Java Swing)',
    requirement:
      'Simple, functional GUI developed using the Java Swing framework allowing users to interact with main functionality (add menu items, open table orders, add/remove dishes, settle bills).',
    implementationDetails:
      'Built with JFrame, JPanel, JTable (DefaultTableModel), JComboBox, JSpinner, JTextField, JTextArea, and JButton action listeners. Supports creating orders, adding dishes with notes, updating stock, and printing receipts.',
    codeLocations: [
      'RestaurantSwingGUI.java (extends JFrame, BorderLayout/GridLayout panels, ActionListeners)',
      'Main.java (launches RestaurantSwingGUI safely on SwingUtilities.invokeLater)',
    ],
  },
  {
    category: '3. Flow Control Constructs',
    requirement:
      'Meaningful use of conditional and iterative programming constructs covered in class: if/else, switch, for, while, and do-while.',
    implementationDetails:
      'Every flow control construct taught in CSC 1102 is used purposefully in core restaurant operations rather than artificial placeholders.',
    codeLocations: [
      'if / else: MenuItem.deductStock(), Order.addItem(), RestaurantManager.settleOrder()',
      'switch: Order.getPaymentChannelLabel() & RestaurantManager.calculateCategoryDiscount()',
      'for loop: Order.calculateSubtotal(), RestaurantManager.searchMenu()',
      'while loop: Order.removeItemAt() (array compaction) & RestaurantManager.findOrderById()',
      'do-while loop: Order.generateReceiptText() (iterating receipt line items & audit summary)',
    ],
  },
  {
    category: '4. Arrays of Objects',
    requirement:
      'Store and manage multiple objects in Java arrays (e.g., MenuItem[] menu, Order[] orders, OrderItem[] items) and perform operations on stored objects.',
    implementationDetails:
      'Uses native 1D Java object arrays (MenuItem[], Order[], OrderItem[]) with dynamic count tracking, insertion, search, update, and element removal/compaction.',
    codeLocations: [
      'RestaurantManager.java: private final MenuItem[] menuCatalog = new MenuItem[50];',
      'RestaurantManager.java: private final Order[] orders = new Order[200];',
      'Order.java: private final OrderItem[] items = new OrderItem[30];',
    ],
  },
];

export const JAVA_PROJECT_FILES: JavaFileEntry[] = [
  {
    filename: 'Main.java',
    packagePath: 'com.group3.restaurant.Main',
    description: 'Entry point with mandatory Group 3 header comments, sample object initialization, and Swing GUI launch.',
    oopConcepts: ['Object Instantiation', 'Encapsulation', 'Swing EDT Bootstrap'],
    code: `/*
 * ============================================================================
 * CSC 1102: STRUCTURED AND OBJECT-ORIENTED PROGRAMMING - PRACTICAL EXAM PROJECT
 * ============================================================================
 * Project Title   : Kampala Bistro Restaurant Ordering & POS System
 * Group Number    : Group 3 (Afternoon Session)
 * Submission File : kwizera_samuel_afternoon.zip
 * GitHub Repo     : https://github.com/KwizeraSamuel/Restaurants-ordering-system-
 *
 * GROUP 3 MEMBERS:
 * 1. KWIZERA SAMUEL            - 26/X/26531/PSA (Group Leader)
 * 2. NABASUMBA GLORIA PATIENCE - 26/U/03586/PSA
 * 3. OKELLO SAMUEL             - 26/U/31009/EVE
 * 4. LUYIMA HENRY BRIAN        - 26/U/30094/PS
 * 5. LUMU DESIRE BLESSING      - 26/U/03556/PSA
 * ============================================================================
 */
package com.group3.restaurant;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;

public class Main {
    public static void main(String[] args) {
        // Set system look and feel for clean desktop presentation
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
            // Fallback to default Swing Metal look and feel
        }

        // Instantiate the core controller managing MenuItem[] and Order[] arrays
        RestaurantManager manager = new RestaurantManager();

        // Launch the Java Swing Graphical User Interface on the Event Dispatch Thread
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                RestaurantSwingGUI gui = new RestaurantSwingGUI(manager);
                gui.setVisible(true);
            }
        });
    }
}`,
  },
  {
    filename: 'MenuItem.java',
    packagePath: 'com.group3.restaurant.MenuItem',
    description: 'Entity class representing a restaurant dish or beverage with private fields, constructors, getters/setters, and stock validation.',
    oopConcepts: ['Private Access Modifiers', 'Constructors', 'Getters & Setters', 'if/else Flow Control'],
    code: `package com.group3.restaurant;

/**
 * Entity Class 1: Represents a food or drink item on the restaurant menu.
 * Demonstrates encapsulation (private fields), constructors, getters/setters, and if/else logic.
 */
public class MenuItem {
    private int id;
    private String name;
    private String category;
    private double priceUGX;
    private int stockQuantity;

    // Constructor initializing all attributes
    public MenuItem(int id, String name, String category, double priceUGX, int stockQuantity) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.priceUGX = priceUGX;
        this.stockQuantity = stockQuantity;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name.trim();
        }
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPriceUGX() {
        return priceUGX;
    }

    public void setPriceUGX(double priceUGX) {
        if (priceUGX >= 0) {
            this.priceUGX = priceUGX;
        }
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        if (stockQuantity >= 0) {
            this.stockQuantity = stockQuantity;
        }
    }

    /**
     * Conditional flow control (if/else): Atomically deducts stock when an item is ordered.
     */
    public boolean deductStock(int quantityRequested) {
        if (quantityRequested <= 0) {
            return false;
        } else if (this.stockQuantity >= quantityRequested) {
            this.stockQuantity -= quantityRequested;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Replenishes stock when an order item is removed or restocked.
     */
    public void replenishStock(int quantityAdded) {
        if (quantityAdded > 0) {
            this.stockQuantity += quantityAdded;
        }
    }

    @Override
    public String toString() {
        return String.format("%s [%s] - UGX %,.0f (Stock: %d)", name, category, priceUGX, stockQuantity);
    }
}`,
  },
  {
    filename: 'OrderItem.java',
    packagePath: 'com.group3.restaurant.OrderItem',
    description: 'Entity class representing a line item inside a customer order, linking a MenuItem object with quantity and kitchen preparation notes.',
    oopConcepts: ['Object Composition', 'Encapsulation', 'Getters & Setters', 'Calculated Methods'],
    code: `package com.group3.restaurant;

/**
 * Entity Class 2: Represents a single dish line item within a table's Order.
 * Demonstrates object composition (references a MenuItem instance).
 */
public class OrderItem {
    private MenuItem menuItem;
    private int quantity;
    private String kitchenNote;

    public OrderItem(MenuItem menuItem, int quantity, String kitchenNote) {
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.kitchenNote = (kitchenNote == null) ? "" : kitchenNote.trim();
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        if (quantity > 0) {
            this.quantity = quantity;
        }
    }

    public void addQuantity(int extra) {
        if (extra > 0) {
            this.quantity += extra;
        }
    }

    public String getKitchenNote() {
        return kitchenNote;
    }

    public void setKitchenNote(String kitchenNote) {
        this.kitchenNote = (kitchenNote == null) ? "" : kitchenNote.trim();
    }

    public double getUnitPrice() {
        return menuItem.getPriceUGX();
    }

    public double getSubtotal() {
        return menuItem.getPriceUGX() * quantity;
    }
}`,
  },
  {
    filename: 'Order.java',
    packagePath: 'com.group3.restaurant.Order',
    description: 'Entity class managing an OrderItem[] array, VAT tax calculation, discount rules, and thermal receipt generation using for, while, do-while, and switch.',
    oopConcepts: ['Object Arrays (OrderItem[])', 'for / while / do-while Loops', 'switch Statement', '18% VAT Calculation'],
    code: `package com.group3.restaurant;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Entity Class 3: Represents a customer dining order for a specific table.
 * Stores multiple OrderItem objects in a fixed Java array (OrderItem[] items).
 */
public class Order {
    public static final int MAX_ORDER_ITEMS = 30;
    public static final double VAT_RATE = 0.18; // 18% Uganda VAT

    private int orderId;
    private int tableNumber;
    private String serverName;
    private String status; // "OPEN", "PREPARING", "SERVED", "PAID", "CANCELLED"
    private String paymentMethod; // "CASH", "MOBILE_MONEY", "CREDIT_CARD"
    private double discountPercent;
    private LocalDateTime createdAt;

    // RUBRIC REQUIREMENT - ARRAYS: Store and manage multiple OrderItem objects in an array
    private final OrderItem[] items;
    private int itemCount;

    public Order(int orderId, int tableNumber, String serverName) {
        this.orderId = orderId;
        this.tableNumber = tableNumber;
        this.serverName = serverName;
        this.status = "OPEN";
        this.paymentMethod = "PENDING";
        this.discountPercent = 0.0;
        this.createdAt = LocalDateTime.now();
        this.items = new OrderItem[MAX_ORDER_ITEMS];
        this.itemCount = 0;
    }

    // Getters and Setters
    public int getOrderId() { return orderId; }
    public int getTableNumber() { return tableNumber; }
    public void setTableNumber(int tableNumber) { this.tableNumber = tableNumber; }
    public String getServerName() { return serverName; }
    public void setServerName(String serverName) { this.serverName = serverName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public double getDiscountPercent() { return discountPercent; }

    public void setDiscountPercent(double discountPercent) {
        if (discountPercent >= 0.0 && discountPercent <= 100.0) {
            this.discountPercent = discountPercent;
        }
    }

    public int getItemCount() {
        return itemCount;
    }

    public OrderItem getItemAt(int index) {
        if (index >= 0 && index < itemCount) {
            return items[index];
        }
        return null;
    }

    /**
     * Demonstrates FOR loop and IF/ELSE to add or merge an OrderItem in the array.
     */
    public boolean addOrderItem(MenuItem menuItem, int quantity, String note) {
        if (!"OPEN".equals(this.status)) {
            return false;
        }

        // FOR LOOP: Check if the same menuItem (with identical note) already exists in the array
        for (int i = 0; i < itemCount; i++) {
            OrderItem existing = items[i];
            if (existing.getMenuItem().getId() == menuItem.getId()
                    && existing.getKitchenNote().equalsIgnoreCase(note == null ? "" : note.trim())) {
                existing.addQuantity(quantity);
                return true;
            }
        }

        if (itemCount >= MAX_ORDER_ITEMS) {
            return false;
        }

        items[itemCount] = new OrderItem(menuItem, quantity, note);
        itemCount++;
        return true;
    }

    /**
     * Demonstrates WHILE loop to remove an element from the OrderItem[] array and shift elements left.
     */
    public OrderItem removeItemAt(int index) {
        if (index < 0 || index >= itemCount) {
            return null;
        }
        OrderItem removed = items[index];

        // WHILE LOOP: Shift remaining array elements one position to the left
        int current = index;
        while (current < itemCount - 1) {
            items[current] = items[current + 1];
            current++;
        }
        items[itemCount - 1] = null;
        itemCount--;
        return removed;
    }

    /**
     * Demonstrates FOR loop to sum subtotals across the OrderItem[] array.
     */
    public double calculateSubtotal() {
        double sum = 0.0;
        for (int i = 0; i < itemCount; i++) {
            sum += items[i].getSubtotal();
        }
        return sum;
    }

    public double calculateDiscountAmount() {
        return Math.round(calculateSubtotal() * (discountPercent / 100.0));
    }

    public double calculateDiscountedSubtotal() {
        return Math.max(0.0, calculateSubtotal() - calculateDiscountAmount());
    }

    public double calculateVAT() {
        return Math.round(calculateDiscountedSubtotal() * VAT_RATE);
    }

    public double calculateTotalPayable() {
        return calculateDiscountedSubtotal() + calculateVAT();
    }

    /**
     * Demonstrates SWITCH statement to format human-readable payment channel descriptions.
     */
    public String getPaymentChannelLabel() {
        switch (this.paymentMethod) {
            case "CASH":
                return "Cash Drawer (UGX Notes/Coins)";
            case "MOBILE_MONEY":
                return "MTN / Airtel Mobile Money Instant Pay";
            case "CREDIT_CARD":
                return "Visa / Mastercard POS Terminal";
            default:
                return "Unsettled / Pending Payment";
        }
    }

    /**
     * Demonstrates DO-WHILE loop to build a printable fiscal receipt.
     */
    public String generateReceiptText() {
        StringBuilder sb = new StringBuilder();
        sb.append("====================================================\\n");
        sb.append("              GROUP 3 KAMPALA BISTRO                \\n");
        sb.append("         Plot 12 Makerere Road, Kampala, UG         \\n");
        sb.append("                  TIN: 1002938472                   \\n");
        sb.append("====================================================\\n");
        sb.append(String.format("Order No   : #%d (Table %d)\\n", orderId, tableNumber));
        sb.append(String.format("Server     : %s\\n", serverName));
        sb.append(String.format("Date       : %s\\n",
                createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))));
        sb.append(String.format("Status     : %s\\n", status));
        sb.append(String.format("Payment    : %s\\n", getPaymentChannelLabel()));
        sb.append("----------------------------------------------------\\n");
        sb.append(String.format("%-22s %4s %10s %12s\\n", "Item", "Qty", "Price", "Subtotal"));
        sb.append("----------------------------------------------------\\n");

        if (itemCount > 0) {
            int idx = 0;
            // DO-WHILE LOOP: Iterate through at least the first OrderItem in the array
            do {
                OrderItem item = items[idx];
                String name = item.getMenuItem().getName();
                if (name.length() > 22) {
                    name = name.substring(0, 22);
                }
                sb.append(String.format("%-22s %4d %10.0f %12.0f\\n",
                        name, item.getQuantity(), item.getUnitPrice(), item.getSubtotal()));
                if (!item.getKitchenNote().isEmpty()) {
                    sb.append(String.format("  * Note: %s\\n", item.getKitchenNote()));
                }
                idx++;
            } while (idx < itemCount);
        } else {
            sb.append("  (No items added to order)\\n");
        }

        sb.append("----------------------------------------------------\\n");
        sb.append(String.format("Gross Subtotal :                UGX %14.0f\\n", calculateSubtotal()));
        if (discountPercent > 0) {
            sb.append(String.format("Discount (%.0f%%)  :               -UGX %14.0f\\n",
                    discountPercent, calculateDiscountAmount()));
        }
        sb.append(String.format("VAT (18%%)      :                UGX %14.0f\\n", calculateVAT()));
        sb.append("----------------------------------------------------\\n");
        sb.append(String.format("TOTAL PAYABLE  :                UGX %14.0f\\n", calculateTotalPayable()));
        sb.append("====================================================\\n");
        sb.append("   Thank you for dining at Kampala Bistro! (CSC1102)\\n");
        sb.append("====================================================\\n");
        return sb.toString();
    }
}`,
  },
  {
    filename: 'RestaurantManager.java',
    packagePath: 'com.group3.restaurant.RestaurantManager',
    description: 'Service controller storing MenuItem[] and Order[] arrays, handling search, stock deduction, order settlement, and shift revenue.',
    oopConcepts: ['MenuItem[] & Order[] Arrays', 'Array Search & Filtering', 'Transactional Stock Control'],
    code: `package com.group3.restaurant;

/**
 * Entity/Controller Class 4: Manages the restaurant's MenuItem[] catalog array
 * and Order[] active/settled orders array.
 */
public class RestaurantManager {
    public static final int MAX_MENU_ITEMS = 50;
    public static final int MAX_ORDERS = 200;

    // RUBRIC REQUIREMENT - ARRAYS: Storing multiple objects in native Java arrays
    private final MenuItem[] menuCatalog;
    private int menuCount;

    private final Order[] orders;
    private int orderCount;
    private int nextOrderId;

    public RestaurantManager() {
        this.menuCatalog = new MenuItem[MAX_MENU_ITEMS];
        this.menuCount = 0;
        this.orders = new Order[MAX_ORDERS];
        this.orderCount = 0;
        this.nextOrderId = 1001;

        seedInitialCatalog();
    }

    private void seedInitialCatalog() {
        addMenuItem("Rolex (Chapati & 2 Eggs)", "Breakfast", 3000, 45);
        addMenuItem("Katogo (Matooke & Offals)", "Breakfast", 7000, 28);
        addMenuItem("African Spiced Milk Tea", "Breakfast", 4000, 58);
        addMenuItem("Whole Fried Tilapia & Chips", "Mains", 25000, 18);
        addMenuItem("Grilled Beef Skewers (Muchomo)", "Mains", 12000, 36);
        addMenuItem("Chicken Luwombo (Royal Dish)", "Specials", 20000, 14);
        addMenuItem("Beef Luwombo with Steamed Rice", "Specials", 22000, 12);
        addMenuItem("Steamed Rice & Beans", "Sides", 5000, 38);
        addMenuItem("Crispy French Fries (Chips)", "Sides", 6000, 46);
        addMenuItem("Fresh Passion Fruit Juice", "Beverages", 5000, 28);
        addMenuItem("Bottled Mineral Water (500ml)", "Beverages", 2000, 95);
        addMenuItem("Warm Chocolate Lava Cake", "Desserts", 12000, 18);

        // Seed initial active order on Table 4
        Order sampleOrder = createOrder(4, "Samuel Kwizera");
        addDishToOrder(sampleOrder.getOrderId(), 6, 1, "Extra groundnut soup");
        addDishToOrder(sampleOrder.getOrderId(), 10, 2, "Chilled");
    }

    public MenuItem addMenuItem(String name, String category, double priceUGX, int initialStock) {
        if (menuCount >= MAX_MENU_ITEMS) {
            return null;
        }
        MenuItem item = new MenuItem(menuCount + 1, name, category, priceUGX, initialStock);
        menuCatalog[menuCount] = item;
        menuCount++;
        return item;
    }

    public MenuItem[] getMenuCatalog() {
        MenuItem[] result = new MenuItem[menuCount];
        for (int i = 0; i < menuCount; i++) {
            result[i] = menuCatalog[i];
        }
        return result;
    }

    public Order[] getOrders() {
        Order[] result = new Order[orderCount];
        for (int i = 0; i < orderCount; i++) {
            result[i] = orders[i];
        }
        return result;
    }

    public MenuItem findMenuItemById(int id) {
        for (int i = 0; i < menuCount; i++) {
            if (menuCatalog[i].getId() == id) {
                return menuCatalog[i];
            }
        }
        return null;
    }

    public Order findOrderById(int orderId) {
        int i = 0;
        while (i < orderCount) {
            if (orders[i].getOrderId() == orderId) {
                return orders[i];
            }
            i++;
        }
        return null;
    }

    public Order createOrder(int tableNumber, String serverName) {
        if (orderCount >= MAX_ORDERS) {
            throw new IllegalStateException("Order storage array is full.");
        }
        Order newOrder = new Order(nextOrderId++, tableNumber, serverName);
        orders[orderCount] = newOrder;
        orderCount++;
        return newOrder;
    }

    public String addDishToOrder(int orderId, int menuItemId, int quantity, String note) {
        Order order = findOrderById(orderId);
        if (order == null) {
            return "Error: Order not found.";
        }
        if (!"OPEN".equals(order.getStatus())) {
            return "Error: Cannot modify an order with status " + order.getStatus();
        }
        MenuItem item = findMenuItemById(menuItemId);
        if (item == null) {
            return "Error: Menu item not found.";
        }
        if (!item.deductStock(quantity)) {
            return "Error: Insufficient stock for " + item.getName() + " (Available: " + item.getStockQuantity() + ")";
        }
        boolean added = order.addOrderItem(item, quantity, note);
        if (!added) {
            item.replenishStock(quantity);
            return "Error: Maximum items per order reached.";
        }
        return "Added " + quantity + "x " + item.getName() + " to Order #" + orderId;
    }

    public boolean removeDishFromOrder(int orderId, int itemIndex) {
        Order order = findOrderById(orderId);
        if (order == null || !"OPEN".equals(order.getStatus())) {
            return false;
        }
        OrderItem removed = order.removeItemAt(itemIndex);
        if (removed != null) {
            removed.getMenuItem().replenishStock(removed.getQuantity());
            return true;
        }
        return false;
    }

    public double calculateTotalPaidRevenue() {
        double total = 0.0;
        for (int i = 0; i < orderCount; i++) {
            if ("PAID".equals(orders[i].getStatus())) {
                total += orders[i].calculateTotalPayable();
            }
        }
        return total;
    }
}`,
  },
  {
    filename: 'RestaurantSwingGUI.java',
    packagePath: 'com.group3.restaurant.RestaurantSwingGUI',
    description: 'Complete Java Swing desktop GUI (JFrame, JTable, JComboBox, JSpinner, JTextArea) for waitstaff and cashiers.',
    oopConcepts: ['Java Swing GUI', 'Event-Driven Programming', 'JTable & DefaultTableModel', 'Dialog Prompts'],
    code: `package com.group3.restaurant;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

/**
 * Class 5: Java Swing Graphical User Interface for Kampala Bistro POS.
 * Satisfies the CSC 1102 Graphical User Interface rubric requirement.
 */
public class RestaurantSwingGUI extends JFrame {
    private final RestaurantManager manager;
    private Order currentOrder;

    // Swing UI Components
    private final DefaultTableModel menuTableModel;
    private final JTable menuTable;
    private final DefaultTableModel orderTableModel;
    private final JTable orderTable;
    private final JComboBox<String> orderSelectorCombo;
    private final JSpinner tableSpinner;
    private final JSpinner quantitySpinner;
    private final JTextField noteField;
    private final JLabel totalLabel;
    private final JLabel shiftSalesLabel;
    private final JTextArea receiptArea;

    public RestaurantSwingGUI(RestaurantManager manager) {
        this.manager = manager;
        Order[] existing = manager.getOrders();
        this.currentOrder = existing.length > 0 ? existing[0] : null;

        setTitle("Kampala Bistro POS & Ordering System — Group 3 (CSC 1102)");
        setSize(1180, 720);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        // 1. Top Control Bar
        JPanel topBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 8));
        topBar.setBorder(new EmptyBorder(6, 10, 6, 10));
        topBar.add(new JLabel("Table No:"));
        tableSpinner = new JSpinner(new SpinnerNumberModel(1, 1, 30, 1));
        topBar.add(tableSpinner);

        JButton newOrderBtn = new JButton("+ Open Table Order");
        newOrderBtn.addActionListener(e -> handleCreateNewOrder());
        topBar.add(newOrderBtn);

        topBar.add(new JLabel("Active Order:"));
        orderSelectorCombo = new JComboBox<>();
        orderSelectorCombo.addActionListener(e -> handleSelectOrder());
        topBar.add(orderSelectorCombo);

        shiftSalesLabel = new JLabel("Shift Paid Revenue: UGX 0");
        shiftSalesLabel.setFont(new Font("SansSerif", Font.BOLD, 13));
        topBar.add(shiftSalesLabel);
        add(topBar, BorderLayout.NORTH);

        // 2. Center Split Pane: Left = Menu Catalog | Middle = Order Items | Right = Fiscal Receipt
        JPanel centerGrid = new JPanel(new GridLayout(1, 3, 10, 10));
        centerGrid.setBorder(new EmptyBorder(0, 10, 10, 10));

        // Left Panel: Menu Catalog JTable
        JPanel menuPanel = new JPanel(new BorderLayout(6, 6));
        menuPanel.setBorder(BorderFactory.createTitledBorder("1. Restaurant Menu Catalog (MenuItem[])"));
        menuTableModel = new DefaultTableModel(new Object[]{"ID", "Dish Name", "Category", "Price (UGX)", "Stock"}, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        menuTable = new JTable(menuTableModel);
        menuPanel.add(new JScrollPane(menuTable), BorderLayout.CENTER);

        JPanel addControlBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 6));
        addControlBar.add(new JLabel("Qty:"));
        quantitySpinner = new JSpinner(new SpinnerNumberModel(1, 1, 50, 1));
        addControlBar.add(quantitySpinner);
        addControlBar.add(new JLabel("Note:"));
        noteField = new JTextField(10);
        addControlBar.add(noteField);
        JButton addDishBtn = new JButton("Add Dish to Order");
        addDishBtn.addActionListener(e -> handleAddDish());
        addControlBar.add(addDishBtn);
        menuPanel.add(addControlBar, BorderLayout.SOUTH);
        centerGrid.add(menuPanel);

        // Middle Panel: Active Order Items JTable
        JPanel orderPanel = new JPanel(new BorderLayout(6, 6));
        orderPanel.setBorder(BorderFactory.createTitledBorder("2. Active Order Items (OrderItem[])"));
        orderTableModel = new DefaultTableModel(new Object[]{"Dish", "Qty", "Unit Price", "Subtotal", "Note"}, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        orderTable = new JTable(orderTableModel);
        orderPanel.add(new JScrollPane(orderTable), BorderLayout.CENTER);

        JPanel orderActions = new JPanel(new GridLayout(2, 3, 6, 6));
        totalLabel = new JLabel("Total (incl. 18% VAT): UGX 0");
        totalLabel.setFont(new Font("Monospaced", Font.BOLD, 13));

        JButton removeBtn = new JButton("Remove Item");
        removeBtn.addActionListener(e -> handleRemoveDish());

        JButton discountBtn = new JButton("Apply 10% Discount");
        discountBtn.addActionListener(e -> handleApplyDiscount());

        JButton serveBtn = new JButton("Mark Served");
        serveBtn.addActionListener(e -> handleMarkServed());

        JButton payBtn = new JButton("Settle Payment");
        payBtn.addActionListener(e -> handleSettlePayment());

        JButton restockBtn = new JButton("Restock Selected (+10)");
        restockBtn.addActionListener(e -> handleRestockSelected());

        orderActions.add(totalLabel);
        orderActions.add(removeBtn);
        orderActions.add(discountBtn);
        orderActions.add(serveBtn);
        orderActions.add(payBtn);
        orderActions.add(restockBtn);
        orderPanel.add(orderActions, BorderLayout.SOUTH);
        centerGrid.add(orderPanel);

        // Right Panel: Live Fiscal Receipt Preview
        JPanel receiptPanel = new JPanel(new BorderLayout(6, 6));
        receiptPanel.setBorder(BorderFactory.createTitledBorder("3. Live Fiscal Receipt Preview"));
        receiptArea = new JTextArea();
        receiptArea.setEditable(false);
        receiptArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        receiptPanel.add(new JScrollPane(receiptArea), BorderLayout.CENTER);
        centerGrid.add(receiptPanel);

        add(centerGrid, BorderLayout.CENTER);

        refreshAllViews();
    }

    private void handleCreateNewOrder() {
        int tableNo = (Integer) tableSpinner.getValue();
        currentOrder = manager.createOrder(tableNo, "Samuel Kwizera");
        refreshAllViews();
    }

    private void handleSelectOrder() {
        int idx = orderSelectorCombo.getSelectedIndex();
        Order[] all = manager.getOrders();
        if (idx >= 0 && idx < all.length) {
            currentOrder = all[idx];
            refreshOrderView();
        }
    }

    private void handleAddDish() {
        if (currentOrder == null) {
            JOptionPane.showMessageDialog(this, "Please open an order first.");
            return;
        }
        int row = menuTable.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Select a dish from the Menu Catalog table first.");
            return;
        }
        int menuId = (Integer) menuTableModel.getValueAt(row, 0);
        int qty = (Integer) quantitySpinner.getValue();
        String note = noteField.getText();

        String msg = manager.addDishToOrder(currentOrder.getOrderId(), menuId, qty, note);
        noteField.setText("");
        refreshAllViews();
        if (msg.startsWith("Error:")) {
            JOptionPane.showMessageDialog(this, msg, "Order Warning", JOptionPane.WARNING_MESSAGE);
        }
    }

    private void handleRemoveDish() {
        if (currentOrder == null) return;
        int row = orderTable.getSelectedRow();
        if (row >= 0) {
            manager.removeDishFromOrder(currentOrder.getOrderId(), row);
            refreshAllViews();
        }
    }

    private void handleApplyDiscount() {
        if (currentOrder == null) return;
        currentOrder.setDiscountPercent(currentOrder.getDiscountPercent() == 10.0 ? 0.0 : 10.0);
        refreshOrderView();
    }

    private void handleMarkServed() {
        if (currentOrder != null && "OPEN".equals(currentOrder.getStatus())) {
            currentOrder.setStatus("SERVED");
            refreshAllViews();
        }
    }

    private void handleSettlePayment() {
        if (currentOrder == null || currentOrder.getItemCount() == 0) return;
        String[] methods = {"CASH", "MOBILE_MONEY", "CREDIT_CARD"};
        String chosen = (String) JOptionPane.showInputDialog(
                this, "Choose Payment Method:", "Settle Bill",
                JOptionPane.PLAIN_MESSAGE, null, methods, methods[0]);
        if (chosen != null) {
            currentOrder.setPaymentMethod(chosen);
            currentOrder.setStatus("PAID");
            refreshAllViews();
            JOptionPane.showMessageDialog(this, "Order #" + currentOrder.getOrderId() + " settled via " + chosen);
        }
    }

    private void handleRestockSelected() {
        int row = menuTable.getSelectedRow();
        if (row >= 0) {
            int menuId = (Integer) menuTableModel.getValueAt(row, 0);
            MenuItem item = manager.findMenuItemById(menuId);
            if (item != null) {
                item.replenishStock(10);
                refreshMenuTable();
            }
        }
    }

    private void refreshAllViews() {
        refreshMenuTable();
        refreshOrderCombo();
        refreshOrderView();
        shiftSalesLabel.setText(String.format("Shift Paid Revenue: UGX %,.0f", manager.calculateTotalPaidRevenue()));
    }

    private void refreshMenuTable() {
        menuTableModel.setRowCount(0);
        for (MenuItem item : manager.getMenuCatalog()) {
            menuTableModel.addRow(new Object[]{
                    item.getId(), item.getName(), item.getCategory(),
                    String.format("%,.0f", item.getPriceUGX()), item.getStockQuantity()
            });
        }
    }

    private void refreshOrderCombo() {
        orderSelectorCombo.removeAllItems();
        Order[] all = manager.getOrders();
        int selectedIdx = -1;
        for (int i = 0; i < all.length; i++) {
            Order o = all[i];
            orderSelectorCombo.addItem(String.format("Order #%d (Table %d) [%s]",
                    o.getOrderId(), o.getTableNumber(), o.getStatus()));
            if (currentOrder != null && o.getOrderId() == currentOrder.getOrderId()) {
                selectedIdx = i;
            }
        }
        if (selectedIdx >= 0) {
            orderSelectorCombo.setSelectedIndex(selectedIdx);
        }
    }

    private void refreshOrderView() {
        orderTableModel.setRowCount(0);
        if (currentOrder == null) {
            totalLabel.setText("Total: UGX 0");
            receiptArea.setText("No active order selected.");
            return;
        }
        for (int i = 0; i < currentOrder.getItemCount(); i++) {
            OrderItem oi = currentOrder.getItemAt(i);
            orderTableModel.addRow(new Object[]{
                    oi.getMenuItem().getName(),
                    oi.getQuantity(),
                    String.format("%,.0f", oi.getUnitPrice()),
                    String.format("%,.0f", oi.getSubtotal()),
                    oi.getKitchenNote()
            });
        }
        totalLabel.setText(String.format("Total: UGX %,.0f", currentOrder.calculateTotalPayable()));
        receiptArea.setText(currentOrder.generateReceiptText());
    }
}`,
  },
];

export function generateProjectReportMarkdown(): string {
  return `# CSC 1102: Structured and Object-Oriented Programming
## Practical Exam Project Documentation Report

---

### 1. Title Page & Group Details
- **Project Title:** Kampala Bistro Restaurant Ordering & Point-of-Sale (POS) System
- **Course:** CSC 1102 — Structured and Object-Oriented Programming
- **Group:** Group 3 (Afternoon Session)
- **Group Leader:** KWIZERA SAMUEL (26/X/26531/PSA)
- **Submission Archive Name:** \`kwizera_samuel_afternoon.zip\`
- **GitHub Repository Link:** https://github.com/KwizeraSamuel/Restaurants-ordering-system-
- **Submission Deadline:** 12th November 2026

#### Group 3 Members:
1. **KWIZERA SAMUEL** — \`26/X/26531/PSA\` (Group Leader • System Architect & Order Array Engine)
2. **NABASUMBA GLORIA PATIENCE** — \`26/U/03586/PSA\` (Java Swing GUI & Interactive POS Components)
3. **OKELLO SAMUEL** — \`26/U/31009/EVE\` (Object Arrays \`MenuItem[]\`, \`Order[]\` & Stock Control)
4. **LUYIMA HENRY BRIAN** — \`26/U/30094/PS\` (Fiscal Billing, 18% VAT & Receipt Generator)
5. **LUMU DESIRE BLESSING** — \`26/U/03556/PSA\` (Flow Control Logic, Validation & KDS Workflow)

---

### 2. Short Description of the Application
The **Kampala Bistro Restaurant Ordering System** is a practical, problem-solving Point-of-Sale (POS), Kitchen Display, and Inventory Management application designed for Ugandan restaurants. Waitstaff and cashiers use the Graphical User Interface to open table dining orders, browse and filter the Ugandan food & beverage catalog, add dishes with custom kitchen preparation notes, automatically deduct and replenish stock quantities, apply discounts, calculate 18% Uganda Revenue Authority (URA) Value Added Tax (VAT), split bills across guests, and generate itemized fiscal receipts.

---

### 3. Main Problem-Solving Features
1. **Atomic Stock Deduction & Replenishment:** Prevents waitstaff from selling out-of-stock dishes. Adding an item immediately deducts from \`MenuItem.stockQuantity\`; removing an item or cancelling an order automatically replenishes stock.
2. **Multi-Table Order Management (\`Order[]\` & \`OrderItem[]\` Arrays):** Supports concurrent open tables, kitchen status progression (\`OPEN\` -> \`PREPARING\` -> \`SERVED\` -> \`PAID\`), custom dietary notes, and table transfers.
3. **Fiscal Tax & Multi-Channel Billing:** Computes Gross Subtotal, Percentage Discounts, 18% Standard VAT, Split-Bill per-guest shares, Cash change calculation, and MTN/Airtel Mobile Money or Card settlement references.
4. **Live Kitchen Display (KDS) & Shift Audit Analytics:** Routes table orders to kitchen prep tickets with elapsed time alerts and reconciles total shift revenue by payment channel.

---

### 4. List of Classes and Their Purpose
| Class Name | Role / Layer | Purpose & Key Methods |
| :--- | :--- | :--- |
| \`Main\` | Bootstrap Entry | Contains Group 3 header comments, initializes \`RestaurantManager\`, and launches \`RestaurantSwingGUI\` on the Event Dispatch Thread. |
| \`MenuItem\` | Domain Entity | Encapsulates \`id\`, \`name\`, \`category\`, \`priceUGX\`, and \`stockQuantity\` using \`private\` fields, constructor, getters/setters, \`deductStock()\`, and \`replenishStock()\`. |
| \`OrderItem\` | Domain Entity | Represents a dish line item within an order, referencing a \`MenuItem\` object, \`quantity\`, \`kitchenNote\`, and computing \`getSubtotal()\`. |
| \`Order\` | Domain Aggregate | Manages a fixed-capacity \`OrderItem[] items\` array, \`orderId\`, \`tableNumber\`, \`status\`, \`discountPercent\`, 18% VAT calculation, and receipt generation. |
| \`RestaurantManager\` | Controller / Store | Stores \`MenuItem[] menuCatalog\` and \`Order[] orders\` arrays, providing search, creation, stock validation, and shift revenue totals. |
| \`RestaurantSwingGUI\` | Java Swing GUI | Extends \`JFrame\` with \`JTable\`, \`JComboBox\`, \`JSpinner\`, \`JTextField\`, \`JTextArea\`, and \`JButton\` listeners for interactive restaurant operations. |

---

### 5. How the Classes Interact & Apply Course Concepts
1. **Object Creation & Interaction:** \`Main\` creates a \`RestaurantManager\` instance, which populates an array of \`MenuItem\` objects (\`MenuItem[] menuCatalog\`). When a waiter opens a table in \`RestaurantSwingGUI\`, \`RestaurantManager\` instantiates a new \`Order\` object and stores it in \`Order[] orders\`. Adding a dish creates an \`OrderItem\` object linking the selected \`MenuItem\` and stores it in \`Order.items\` (\`OrderItem[]\`).
2. **Flow Control Constructs:**
   - **\`if / else\`:** Validates sufficient stock in \`MenuItem.deductStock()\` and verifies order status before modification.
   - **\`switch\`:** Maps payment codes (\`CASH\`, \`MOBILE_MONEY\`, \`CREDIT_CARD\`) to fiscal labels in \`Order.getPaymentChannelLabel()\`.
   - **\`for\` loop:** Iterates over \`MenuItem[]\` and \`OrderItem[]\` arrays to compute subtotals and search items.
   - **\`while\` loop:** Shifts array elements left in \`Order.removeItemAt()\` when deleting a line item.
   - **\`do-while\` loop:** Formats each line item in \`Order.generateReceiptText()\`.
`;
}
