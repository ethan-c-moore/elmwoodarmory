import {CartItem} from '../services/cart/cart-item.interface';

export interface Address {
  addressLine1: string;
  addressLine2: string;
  adminArea1: string;
  adminArea2: string;
  countryCode: string;
  postalCode: string;
  firstName?: string;
  lastName?: string;
}

export interface APIRef {
  shipping: {};
  taxes: {};
  payment: {};
}

export interface Totals {
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
}

export interface Order {
  orderId: string;
  status: string;
  cartItems: CartItem[],
  shipping: Address;
  billing: Address;
  totals: Totals;
  apiRef: APIRef;
  orderDate: Date;
  email: string;
  phone: string;
}
