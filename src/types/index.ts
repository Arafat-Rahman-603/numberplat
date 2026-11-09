export type PlateType = "front" | "back" | "both";

export type OrderStatus =
  | "Pending"
  | "Awaiting Payment"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

export type PaymentStatus =
  | "Unpaid"
  | "Advance Paid"
  | "Partially Paid"
  | "Fully Paid"
  | "Failed"
  | "Refunded";

export type PaymentMethod = "cod" | "bkash_advance" | "bkash_full";

export type DeliveryZone = "inside_dhaka" | "outside_dhaka";

export interface CustomPlateDetails {
  plateType: PlateType;
  metroCity: string;
  vehicleClass: string;
  seriesNumber: string;
  plateNumber: string;
  fullPlateText: string;
  plateColor?: "black_acrylic" | "white_reflective" | "yellow_reflective";
}

export interface OrderItem {
  id: string;
  name: string;
  plateType: PlateType;
  customDetails: CustomPlateDetails;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryZone: DeliveryZone;
  district: string;
  notes?: string;

  items: OrderItem[];

  originalSubtotal: number;
  discountPercentage: number;
  discountAmount: number;
  discountedSubtotal: number;
  shippingCharge: number;
  totalPayable: number;
  advanceAmount: number;
  remainingCodAmount: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;

  bkashPaymentId?: string;
  bkashTrxId?: string;
  bkashPaymentDate?: string;
}

export interface AdminSettings {
  discountOfferEnabled: boolean;
  discountPercentage: number;
  minAdvanceAmount: number;
  shippingInsideDhaka: number;
  shippingOutsideDhaka: number;
  frontPlatePrice: number;
  backPlatePrice: number;
  comboPlatePrice: number;
  hotlinePhone: string;
  whatsappNumber: string;
  announcementText: string;
}

export interface PricingBreakdown {
  originalSubtotal: number;
  discountEligible: boolean;
  discountPercentage: number;
  discountAmount: number;
  discountedSubtotal: number;
  shippingCharge: number;
  totalPayable: number;
  advanceAmount: number;
  remainingCodAmount: number;
}

