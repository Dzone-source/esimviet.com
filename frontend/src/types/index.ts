export interface Country {
  id: number;
  name: string;
  slug: string;
  flag: string;
  cover_image?: string;
  region?: string;
  is_popular: boolean;
  is_active: boolean;
  _count?: { plans: number };
  plans?: Plan[];
}

export interface Plan {
  id: number;
  country_id: number;
  title: string;
  days: number;
  data_amount: string;
  price: string | number;
  description?: string;
  network: string;
  hotspot: boolean;
  speed?: string;
  is_active: boolean;
  country?: Country;
}

export interface OrderItem {
  id: number;
  order_id: number;
  plan_id: number;
  qty: number;
  price: string | number;
  plan?: Plan;
  esim_codes?: EsimCode[];
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  paypal_order_id?: string;
  status: OrderStatus;
  paid_at?: string;
  total: string | number;
  created_at: string;
  order_items?: OrderItem[];
}

export type OrderStatus =
  | 'Pending'
  | 'Paid'
  | 'WaitingUpload'
  | 'Completed'
  | 'Cancelled'
  | 'Refunded';

export interface EsimCode {
  id: number;
  plan_id: number;
  activation_code?: string;
  qr_image?: string;
  manual_code?: string;
  status: 'available' | 'sold';
  assigned_order?: number;
  order_item_id?: number;
  created_at: string;
}

export interface Settings {
  site_name?: string;
  logo?: string;
  facebook?: string;
  contact_email?: string;
  paypal_client_id?: string;
  paypal_secret?: string;
}

export interface CheckoutForm {
  customer_name: string;
  customer_email: string;
  quantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ msg: string; path: string }>;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
