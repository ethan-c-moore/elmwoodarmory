import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDB } from "./database";
import session from "express-session";
import { CartItem } from "./cart.model";

declare module "express-session" {
    interface SessionData {
        cart?: CartItem[];
    }
}

dotenv.config();

import contactRoutes from "./contact.routes";
import cartRoutes from "./cart.routes";
import paypalRoutes from "./paypal.routes";
import orderRoutes from "./order.routes";

const { ATLAS_URI, SESSION_SECRET } = process.env;

if (!ATLAS_URI) {
    console.error("No Atlas URI found in config.env");
    process.exit(1);
}

connectToDB(ATLAS_URI)
    .then(() => {
        const app = express();

        app.use(cors({
            origin: "http://localhost:4200",
            credentials: true
        }));
        app.use(express.json());
        app.use(session({
            secret: SESSION_SECRET!, // ideally use env variable
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
            }
        }));

        const routes = [
            { path: "/api/contact", handler: contactRoutes },
            { path: "/api/cart", handler: cartRoutes },
            { path: "/api/paypal", handler: paypalRoutes },
            { path: "/api/orders", handler: orderRoutes },
        ];

        routes.forEach(({ path, handler }) => {
            app.use(path, handler);
        });

        app.listen(5200, () => {
            console.log("Server running on port 5200.");
        });
    })
    .catch((error) => console.error(error));