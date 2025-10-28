import * as mongodb from "mongodb";
import { Contact } from "./contact";
import { Gallery } from "./gallery";
import { Product } from "./product";
import { Order } from "./order";
import { Event } from "./event";
import { Address } from "./address";
import { Customer } from "./customer"

export const collections: {
    contacts?: mongodb.Collection<Contact>;
    galleries?: mongodb.Collection<Gallery>;
    products?: mongodb.Collection<Product>;
    orders?: mongodb.Collection<Order>;
    events?: mongodb.Collection<Event>;
    addresses?: mongodb.Collection<Address>
    customers?: mongodb.Collection<Customer>
} = {};

export async function connectToDB(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("ewa");
    // await applySchemaValidation(db);

    collections.contacts = db.collection<Contact>("contacts");
    collections.galleries = db.collection<Gallery>("galleries");
    collections.products = db.collection<Product>("products");
    collections.orders = db.collection<Order>("orders");
    collections.events = db.collection<Event>("events");
    collections.addresses = db.collection<Address>("addresses");
    collections.customers = db.collection<Customer>("customers");
}

//I'll implement this later - I don't know how to implement multiple schemas for validation
export async function applySchemaValidation(db: mongodb.Db) {

}