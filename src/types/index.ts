export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
  sort_order: number;
  created_at: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'refused';

export type PaymentMethod = 'amana' | 'nita';

export interface OrderItem {
  id: string;
  order_id: string;
  dish_id: string | null;
  dish_name: string;
  dish_price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  neighborhood: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  payment_method: PaymentMethod;
  status: OrderStatus;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export type AppView =
  | 'home'
  | 'cart'
  | 'checkout'
  | 'order-status'
  | 'restaurant'
  | 'admin';
