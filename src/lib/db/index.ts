import fs from "fs";
import path from "path";
import { Order, AdminSettings } from "@/types";
import { DEFAULT_SETTINGS } from "../pricing/calculator";

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

function ensureDirectoryExistence() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    const seedOrders: Order[] = [
      {
        id: "ord_101",
        orderNumber: "BP-261101",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        customerName: "তানভীর আহমেদ",
        customerPhone: "01712345678",
        customerEmail: "tanvir@example.com",
        deliveryAddress: "বাড়ি ১২, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা",
        deliveryZone: "inside_dhaka",
        district: "ঢাকা",
        notes: "মাডগার্ডের সাথে স্ক্রু থাকলে ভালো হয়",
        items: [
          {
            id: "item_1",
            name: "সামনে + পেছনের প্লেট কম্বো",
            plateType: "both",
            customDetails: {
              plateType: "both",
              metroCity: "ঢাকা মেট্রো",
              vehicleClass: "হ",
              seriesNumber: "১২",
              plateNumber: "৩৪৫৬",
              fullPlateText: "ঢাকা মেট্রো-হ-১২-৩৪৫৬",
              plateColor: "white_reflective",
            },
            unitPrice: 650,
            quantity: 1,
          },
        ],
        originalSubtotal: 650,
        discountPercentage: 30,
        discountAmount: 195,
        discountedSubtotal: 455,
        shippingCharge: 70,
        totalPayable: 525,
        advanceAmount: 100,
        remainingCodAmount: 425,
        paymentMethod: "bkash_advance",
        paymentStatus: "Advance Paid",
        orderStatus: "Processing",
        bkashPaymentId: "TRX88291BKASH",
        bkashTrxId: "BK992841029",
        bkashPaymentDate: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: "ord_102",
        orderNumber: "BP-261102",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        customerName: "রাকিবুল হাসান",
        customerPhone: "01898765432",
        customerEmail: "rakib@example.com",
        deliveryAddress: "নিউ মার্কেট মোড়, খুলনা সদর, খুলনা",
        deliveryZone: "outside_dhaka",
        district: "খুলনা",
        items: [
          {
            id: "item_2",
            name: "প্রিমিয়াম ফ্রন্ট নম্বর প্লেট",
            plateType: "front",
            customDetails: {
              plateType: "front",
              metroCity: "খুলনা মেট্রো",
              vehicleClass: "ল",
              seriesNumber: "১১",
              plateNumber: "০৭৮৩",
              fullPlateText: "খুলনা মেট্রো-ল-১১-০৭৮৩",
              plateColor: "white_reflective",
            },
            unitPrice: 350,
            quantity: 1,
          },
        ],
        originalSubtotal: 350,
        discountPercentage: 0,
        discountAmount: 0,
        discountedSubtotal: 350,
        shippingCharge: 130,
        totalPayable: 480,
        advanceAmount: 0,
        remainingCodAmount: 480,
        paymentMethod: "cod",
        paymentStatus: "Unpaid",
        orderStatus: "Confirmed",
      },
      {
        id: "ord_103",
        orderNumber: "BP-261103",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        customerName: "মাহবুব আলম",
        customerPhone: "01911223344",
        deliveryAddress: "জিন্দাবাজার, সিলেট",
        deliveryZone: "outside_dhaka",
        district: "সিলেট",
        items: [
          {
            id: "item_3",
            name: "সামনে + পেছনের প্লেট কম্বো",
            plateType: "both",
            customDetails: {
              plateType: "both",
              metroCity: "সিলেট মেট্রো",
              vehicleClass: "হ",
              seriesNumber: "১৭",
              plateNumber: "৯৫১২",
              fullPlateText: "সিলেট মেট্রো-হ-১৭-৯৫১২",
              plateColor: "white_reflective",
            },
            unitPrice: 650,
            quantity: 1,
          },
        ],
        originalSubtotal: 650,
        discountPercentage: 30,
        discountAmount: 195,
        discountedSubtotal: 455,
        shippingCharge: 130,
        totalPayable: 585,
        advanceAmount: 585,
        remainingCodAmount: 0,
        paymentMethod: "bkash_full",
        paymentStatus: "Fully Paid",
        orderStatus: "Shipped",
        bkashPaymentId: "TRX99182FULL",
        bkashTrxId: "BK994819441",
        bkashPaymentDate: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(seedOrders, null, 2), "utf-8");
  }
}

export function getAllOrders(): Order[] {
  ensureDirectoryExistence();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read orders:", e);
    return [];
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getAllOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export function createOrder(order: Order): Order {
  ensureDirectoryExistence();
  const orders = getAllOrders();
  // Ensure no duplicate order ID
  const existingIndex = orders.findIndex((o) => o.id === order.id || o.orderNumber === order.orderNumber);
  if (existingIndex >= 0) {
    orders[existingIndex] = order;
  } else {
    orders.unshift(order);
  }
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return order;
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  ensureDirectoryExistence();
  const orders = getAllOrders();
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return orders[index];
}

export function getSettings(): AdminSettings {
  ensureDirectoryExistence();
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(updates: Partial<AdminSettings>): AdminSettings {
  ensureDirectoryExistence();
  const current = getSettings();
  const updated = { ...current, ...updates };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

