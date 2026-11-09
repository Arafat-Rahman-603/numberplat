import { pgTable, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryZone: text("delivery_zone").notNull(),
  district: text("district").notNull(),
  notes: text("notes"),

  items: jsonb("items").notNull(),

  originalSubtotal: integer("original_subtotal").notNull(),
  discountPercentage: integer("discount_percentage").notNull().default(0),
  discountAmount: integer("discount_amount").notNull().default(0),
  discountedSubtotal: integer("discounted_subtotal").notNull(),
  shippingCharge: integer("shipping_charge").notNull(),
  totalPayable: integer("total_payable").notNull(),
  advanceAmount: integer("advance_amount").notNull().default(0),
  remainingCodAmount: integer("remaining_cod_amount").notNull(),

  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull(),
  orderStatus: text("order_status").notNull(),

  bkashPaymentId: text("bkash_payment_id"),
  bkashTrxId: text("bkash_trx_id"),
  bkashPaymentDate: text("bkash_payment_date"),
});

export const settingsTable = pgTable("settings", {
  id: text("id").primaryKey().default("default"),
  discountOfferEnabled: boolean("discount_offer_enabled").notNull().default(true),
  discountPercentage: integer("discount_percentage").notNull().default(30),
  minAdvanceAmount: integer("min_advance_amount").notNull().default(100),
  shippingInsideDhaka: integer("shipping_inside_dhaka").notNull().default(70),
  shippingOutsideDhaka: integer("shipping_outside_dhaka").notNull().default(130),
  frontPlatePrice: integer("front_plate_price").notNull().default(350),
  backPlatePrice: integer("back_plate_price").notNull().default(400),
  comboPlatePrice: integer("combo_plate_price").notNull().default(650),
  hotlinePhone: text("hotline_phone").notNull().default("01700-000000"),
  whatsappNumber: text("whatsapp_number").notNull().default("+8801700000000"),
  announcementText: text("announcement_text").notNull().default("সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা | ১০০ টাকা অগ্রিম পেমেন্টে নিশ্চিত ৩০% ছাড়!"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

