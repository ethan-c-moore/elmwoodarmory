import * as mongodb from "mongodb";

export interface Contact {
    contactInfo: {
        firstName: string;
        lastName: string;
        contactType: "phone" | "email";
        value: string;
    };
    request: {
        requestType: "commission" | "repair" | "other";
        message: string;
        pieceType?: "tack" | "armor" | "accessory" | "other";
    };
    contactDate: Date;
    status: [
        {
            code: "new" | "pending" | "scheduling" | "scheduled" | "in-progress" | "update" | "complete" | "canceled";
            upDate: Date;
            message: string;
            statusOwner: string;
        }
    ];
    shopRef: number;
    shopAttribute: [
        {
            name: string;
            value: string;
        }
    ];
    _id?: mongodb.ObjectId;
}