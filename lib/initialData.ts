import { MenuItem, Order, TableInfo } from '@/types/restaurant';

export const VAT_RATE = 0.18; // 18% standard VAT
export const EXCHANGE_RATE_USD_TO_UGX = 3750;

export const INITIAL_MENU: MenuItem[] = [
  // Breakfast
  {
    id: 1,
    name: 'Rolex (Chapati & 2 Eggs)',
    category: 'Breakfast',
    priceUGX: 3000,
    priceUSD: 0.80,
    stockQuantity: 45,
    initialStock: 50,
    description: 'Freshly rolled street chapati with two seasoned fried eggs, tomatoes, and red onions.',
    isPopular: true,
  },
  {
    id: 2,
    name: 'Katogo (Matooke & Offals)',
    category: 'Breakfast',
    priceUGX: 7000,
    priceUSD: 1.90,
    stockQuantity: 28,
    initialStock: 30,
    description: 'Traditional Ugandan breakfast stew of steamed green bananas slow-cooked with spiced beef offals.',
    isPopular: true,
  },
  {
    id: 8,
    name: 'African Spiced Milk Tea',
    category: 'Breakfast',
    priceUGX: 4000,
    priceUSD: 1.10,
    stockQuantity: 58,
    initialStock: 60,
    description: 'Fresh whole milk infused with ginger, cardamom, cinnamon, and highland black tea.',
    isPopular: true,
  },

  // Mains
  {
    id: 3,
    name: 'Whole Fried Tilapia & Chips',
    category: 'Mains',
    priceUGX: 25000,
    priceUSD: 6.70,
    stockQuantity: 18,
    initialStock: 20,
    description: 'Lake Victoria fresh whole tilapia fried crisp, served with golden hand-cut fries and tartar dip.',
    isPopular: true,
  },
  {
    id: 4,
    name: 'Grilled Beef Skewers (Muchomo)',
    category: 'Mains',
    priceUGX: 12000,
    priceUSD: 3.20,
    stockQuantity: 36,
    initialStock: 40,
    description: 'Tender marinated beef chunks grilled over charcoal with kachumbari salad and roasted cassava.',
    isPopular: true,
  },
  {
    id: 11,
    name: 'Margherita Pizza (12-inch)',
    category: 'Mains',
    priceUGX: 30000,
    priceUSD: 8.00,
    stockQuantity: 24,
    initialStock: 25,
    description: 'Stone-baked thin crust with San Marzano tomato sauce, fresh mozzarella, and sweet basil.',
  },
  {
    id: 12,
    name: 'Cheeseburger Deluxe & Fries',
    category: 'Mains',
    priceUGX: 24000,
    priceUSD: 6.40,
    stockQuantity: 30,
    initialStock: 35,
    description: 'Double grilled beef patty, melted cheddar cheese, caramelized onions, house pickles, and french fries.',
    isPopular: true,
  },
  {
    id: 13,
    name: 'Grilled Chicken Caesar Salad',
    category: 'Mains',
    priceUGX: 22000,
    priceUSD: 5.90,
    stockQuantity: 22,
    initialStock: 25,
    description: 'Flame-grilled herb chicken breast, crisp romaine lettuce, shaved parmesan, garlic croutons, and Caesar dressing.',
  },

  // Specials
  {
    id: 5,
    name: 'Chicken Luwombo (Royal Dish)',
    category: 'Specials',
    priceUGX: 20000,
    priceUSD: 5.30,
    stockQuantity: 14,
    initialStock: 15,
    description: 'Steamed country chicken stewed in smoked banana leaves with rich peanut paste and matooke.',
    isPopular: true,
  },
  {
    id: 14,
    name: 'Beef Luwombo with Steamed Rice',
    category: 'Specials',
    priceUGX: 22000,
    priceUSD: 5.90,
    stockQuantity: 12,
    initialStock: 15,
    description: 'Slow-steamed smoked beef in banana leaf pouch, seasoned with traditional local spices.',
  },

  // Sides
  {
    id: 6,
    name: 'Steamed Rice & Beans',
    category: 'Sides',
    priceUGX: 5000,
    priceUSD: 1.35,
    stockQuantity: 38,
    initialStock: 40,
    description: 'Fragrant steamed long-grain rice paired with slow-simmered savory kidney beans.',
  },
  {
    id: 7,
    name: 'Crispy French Fries (Chips)',
    category: 'Sides',
    priceUGX: 6000,
    priceUSD: 1.60,
    stockQuantity: 46,
    initialStock: 50,
    description: 'Hand-cut fresh potato chips tossed with sea salt and served with homemade chili mayo.',
  },
  {
    id: 15,
    name: 'Garlic Herb Bread (4 Pcs)',
    category: 'Sides',
    priceUGX: 6000,
    priceUSD: 1.60,
    stockQuantity: 32,
    initialStock: 35,
    description: 'Toasted baguette slices brushed with garlic parsley butter and melted mozzarella.',
  },

  // Beverages
  {
    id: 9,
    name: 'Fresh Passion Fruit Juice',
    category: 'Beverages',
    priceUGX: 5000,
    priceUSD: 1.35,
    stockQuantity: 28,
    initialStock: 30,
    description: 'Freshly pressed organic passion fruit, chilled and served with wild flower honey.',
    isPopular: true,
  },
  {
    id: 10,
    name: 'Bottled Mineral Water (500ml)',
    category: 'Beverages',
    priceUGX: 2000,
    priceUSD: 0.55,
    stockQuantity: 95,
    initialStock: 100,
    description: 'Chilled pure natural spring water.',
  },
  {
    id: 16,
    name: 'Single Espresso',
    category: 'Beverages',
    priceUGX: 5000,
    priceUSD: 1.35,
    stockQuantity: 60,
    initialStock: 60,
    description: 'Bold Ugandan arabica roast espresso shot with rich golden crema.',
  },
  {
    id: 17,
    name: 'Foamy Cappuccino',
    category: 'Beverages',
    priceUGX: 7000,
    priceUSD: 1.90,
    stockQuantity: 40,
    initialStock: 40,
    description: 'Double shot arabica espresso topped with velvety steamed milk foam and cocoa dusting.',
  },

  // Desserts
  {
    id: 18,
    name: 'Warm Chocolate Lava Cake',
    category: 'Desserts',
    priceUGX: 12000,
    priceUSD: 3.20,
    stockQuantity: 18,
    initialStock: 20,
    description: 'Decadent molten dark chocolate center, served warm with vanilla bean gelato scoop.',
    isPopular: true,
  },
  {
    id: 19,
    name: 'New York Baked Cheesecake',
    category: 'Desserts',
    priceUGX: 14000,
    priceUSD: 3.75,
    stockQuantity: 15,
    initialStock: 15,
    description: 'Classic creamy baked cheesecake on graham cracker crust with strawberry coulis.',
  },
];

export const INITIAL_TABLES: TableInfo[] = Array.from({ length: 24 }, (_, idx) => {
  const id = idx + 1;
  let zone: TableInfo['zone'] = 'Main Dining';
  if (id >= 9 && id <= 14) zone = 'Terrace';
  else if (id >= 15 && id <= 18) zone = 'VIP Lounge';
  else if (id >= 19 && id <= 24) zone = 'Garden';

  const seats = id % 4 === 0 ? 6 : id % 2 === 0 ? 4 : 2;

  let status: TableInfo['status'] = 'FREE';
  let activeOrderId: number | undefined;

  if (id === 4) {
    status = 'OCCUPIED';
    activeOrderId = 1001;
  } else if (id === 7) {
    status = 'SERVED';
    activeOrderId = 1002;
  } else if (id === 12) {
    status = 'OCCUPIED';
    activeOrderId = 1003;
  }

  return {
    id,
    zone,
    seats,
    status,
    activeOrderId,
  };
});

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1001,
    orderNumber: '#1001',
    tableNumber: 4,
    status: 'OPEN',
    serverName: 'Samuel Kwizera',
    items: [
      {
        menuItemId: 5,
        name: 'Chicken Luwombo (Royal Dish)',
        category: 'Specials',
        unitPriceUGX: 20000,
        unitPriceUSD: 5.30,
        quantity: 1,
        subtotalUGX: 20000,
        subtotalUSD: 5.30,
        notes: 'Extra groundnut soup',
      },
      {
        menuItemId: 9,
        name: 'Fresh Passion Fruit Juice',
        category: 'Beverages',
        unitPriceUGX: 5000,
        unitPriceUSD: 1.35,
        quantity: 2,
        subtotalUGX: 10000,
        subtotalUSD: 2.70,
      },
    ],
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    subtotalUGX: 30000,
    subtotalUSD: 8.00,
    taxUGX: 5400,
    taxUSD: 1.44,
    totalUGX: 35400,
    totalUSD: 9.44,
  },
  {
    id: 1002,
    orderNumber: '#1002',
    tableNumber: 7,
    status: 'SERVED',
    serverName: 'Gloria Patience',
    items: [
      {
        menuItemId: 3,
        name: 'Whole Fried Tilapia & Chips',
        category: 'Mains',
        unitPriceUGX: 25000,
        unitPriceUSD: 6.70,
        quantity: 2,
        subtotalUGX: 50000,
        subtotalUSD: 13.40,
        notes: 'Crispy skin, spicy kachumbari',
      },
      {
        menuItemId: 10,
        name: 'Bottled Mineral Water (500ml)',
        category: 'Beverages',
        unitPriceUGX: 2000,
        unitPriceUSD: 0.55,
        quantity: 2,
        subtotalUGX: 4000,
        subtotalUSD: 1.10,
      },
    ],
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    servedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    subtotalUGX: 54000,
    subtotalUSD: 14.50,
    taxUGX: 9720,
    taxUSD: 2.61,
    totalUGX: 63720,
    totalUSD: 17.11,
  },
  {
    id: 1003,
    orderNumber: '#1003',
    tableNumber: 12,
    status: 'OPEN',
    serverName: 'Henry Brian Luyima',
    items: [
      {
        menuItemId: 1,
        name: 'Rolex (Chapati & 2 Eggs)',
        category: 'Breakfast',
        unitPriceUGX: 3000,
        unitPriceUSD: 0.80,
        quantity: 3,
        subtotalUGX: 9000,
        subtotalUSD: 2.40,
      },
      {
        menuItemId: 8,
        name: 'African Spiced Milk Tea',
        category: 'Breakfast',
        unitPriceUGX: 4000,
        unitPriceUSD: 1.10,
        quantity: 3,
        subtotalUGX: 12000,
        subtotalUSD: 3.30,
      },
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    subtotalUGX: 21000,
    subtotalUSD: 5.70,
    taxUGX: 3780,
    taxUSD: 1.03,
    totalUGX: 24780,
    totalUSD: 6.73,
  },
];

export function formatCurrency(amount: number, currency: 'UGX' | 'USD'): string {
  if (currency === 'UGX') {
    return 'UGX ' + Math.round(amount).toLocaleString('en-US');
  }
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
