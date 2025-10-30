import * as mongodb from "mongodb";
import { Address } from "./address";

export interface Customer {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    shipping: Address;
    billing: Address;
}