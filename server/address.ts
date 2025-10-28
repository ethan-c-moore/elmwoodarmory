import * as mongodb from "mongodb";

export interface Address {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
}