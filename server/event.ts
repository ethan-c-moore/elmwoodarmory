import * as mongodb from "mongodb";
import { Address } from "./address";

export interface Event {
    name: string;
    description: string;
    dateStart: Date;
    dateEnd: Date;
    address: Address;
    img?: string;
    link: string;
}