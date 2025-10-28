import * as mongodb from "mongodb";
import {CartItem} from "./cart.model";

export interface Address {
    addressLine1: string;
    addressLine2: string;
    adminArea1: string;
    adminArea2: string;
    countryCode: string;
    postalCode: string;
    firstName: string;
    lastName: string;
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
}

export interface Order {
    orderID: string;
    status: string;
    cartItems: CartItem[];
    billing: Address;
    shipping: Address;
    totals: Totals;
    apiRef: APIRef;
    orderDate: Date;
    email: string;
    phone: string;
    _id?: mongodb.ObjectId;
}