export const STORE_CONFIG = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Resin & Paper Craft",
  tagline: "Handcrafted with Love, Preserved with Care",
  description:
    "Artisanal resin art, pressed floral treasures, and hand-sculpted paper creations made for moments of beauty and heartfelt gifting.",
  currency: "৳",
  currencyCode: "BDT",
  defaultDeliveryFee: Number(process.env.DEFAULT_DELIVERY_FEE || 80),
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+880 1700-000000",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@resincraft.com",
    address:
      process.env.NEXT_PUBLIC_CONTACT_ADDRESS ||
      "Dhanmondi, Dhaka - 1209, Bangladesh",
    hours: "Saturday - Thursday: 10:00 AM - 8:00 PM",
    instagram: "@resinpapercraft.studio",
    facebook: "fb.com/resinpapercraft",
  },
  paymentMethod: "Cash on Delivery",
};

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  Pending: {
    label: "Pending",
    color: "text-amber-800",
    bg: "bg-amber-50 border-amber-200",
  },
  Confirmed: {
    label: "Confirmed",
    color: "text-blue-800",
    bg: "bg-blue-50 border-blue-200",
  },
  Processing: {
    label: "Processing",
    color: "text-purple-800",
    bg: "bg-purple-50 border-purple-200",
  },
  Shipped: {
    label: "Shipped",
    color: "text-indigo-800",
    bg: "bg-indigo-50 border-indigo-200",
  },
  Delivered: {
    label: "Delivered",
    color: "text-emerald-800",
    bg: "bg-emerald-50 border-emerald-200",
  },
  Cancelled: {
    label: "Cancelled",
    color: "text-rose-800",
    bg: "bg-rose-50 border-rose-200",
  },
};
