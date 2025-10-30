import { Request, Response, Router } from 'express';
import {collections} from "./database";

import {sendOrderConfirmation} from "./mailer";

const router = Router();

router.post('/store', async (req: Request, res: Response) => {
    if (!req.session.cart) {
        return res.status(400).json({message: "Cart is empty!"});
    }
    let orderResp: {code: number, message: string} = await recordOrder(req.body);

    await sendOrderConfirmation(req.session.cart, req.body)
        .catch(err => console.error("Error sending order confirmation:", err));

    if (orderResp.code === 201) req.session.cart = [];

    res.status(orderResp.code).json({message: orderResp.message});
})

async function recordOrder(orderData: any) {
    try {
        const result = await collections.orders?.insertOne(orderData);
        if (!result?.acknowledged) {
            console.log("Failed to insert order:", result);
            return {code: 500, message: "Failure to record order."};
        }

        return {code: 201, message: "Order recorded."};
    } catch (err) {
        console.log("Error inserting order:", err);
        return {code: 500, message: `Error inserting order: ${err}`};
    }
}

export default router;