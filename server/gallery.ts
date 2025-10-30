import * as mongodb from "mongodb";

export interface Gallery {
    name: string;
    description: string;
    tags: [
        {
            name: string;
        }
    ];
    images: [
        {
            name: string;
            description: string;
            url: string;
            sortOrder: number;
        }
    ];
    sortOrder: number;
    _id?: mongodb.ObjectId;
}