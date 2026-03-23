export interface FlagDef {
  key: string;
  label: string;
  description: string;
}

export interface CartItem {
  name: string;
  price: number;
}

export const ALL_FLAGS: FlagDef[] = [
  {
    key: "new-checkout",
    label: "New Checkout Flow",
    description: "Redesigned checkout experience with improved UX",
  },
  {
    key: "dark-mode",
    label: "Dark Mode",
    description: "Application-wide dark colour scheme",
  },
  {
    key: "promo-banner",
    label: "Promo Banner",
    description: "Show promotional banner at the top of the page",
  },
  {
    key: "maintenance-mode",
    label: "Maintenance Mode",
    description: "Show maintenance overlay, blocking all interactions",
  },
  {
    key: "user-feedback",
    label: "Feedback Widget",
    description: "Floating widget for collecting user feedback",
  },
];

export const CART: CartItem[] = [
  { name: "Wireless Headphones", price: 79.99 },
  { name: "USB-C Cable", price: 12.99 },
  { name: "Phone Stand", price: 24.99 },
];
