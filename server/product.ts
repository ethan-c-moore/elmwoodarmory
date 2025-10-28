import * as mongodb from "mongodb";

export interface Product {
    name: string;
    description: string;
    price: string;
    attributes: [
        {
            name: string;
            value: string;
        }
    ];
    _id?: mongodb.ObjectId;
}