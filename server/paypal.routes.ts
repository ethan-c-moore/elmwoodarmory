import {Request, Response, Router} from "express";
import {
    ApiError,
    CheckoutPaymentIntent,
    Client,
    Environment,
    OrdersController,
    PaymentsController
} from '@paypal/paypal-server-sdk';
import {CartItem} from "./cart.model";

const router = Router();

const {
    PAYPAL_ENVIRONMENT,
    PAYPAL_CLIENT_ID,
    PAYPAL_SECRET
} = process.env;

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID!,
        oAuthClientSecret: PAYPAL_SECRET!
    },
    timeout: 0,
    environment: PAYPAL_ENVIRONMENT! == 'SANDBOX' ? Environment.Sandbox : Environment.Production,
    logging: {
        // logLevel: LogLevel.Trace,
        logRequest: { logBody: false, },
        logResponse: { logHeaders: false }
    }
});

const ordersController = new OrdersController(client);
const paymentsController = new PaymentsController(client);

router.post('/create', async (req: Request, res: Response) => {
    if (!req.session.cart) {
        return res.status(400).json({ error: 'Cart is empty!' });
    }
    const { shipping } = req.body.values;
    let createOrderData = await createOrder(req.session.cart, ['84029', '84074', '84701'].includes(shipping.postalCode.toString()));
    res.status(200).json(createOrderData);
})

router.post('/capture', async (req: Request, res: Response) => {
    let capturePaymentData = await capturePayment(req.body.orderID);
    res.status(200).json(capturePaymentData);
});

async function createOrder(cart: CartItem[], isFreeShipping: boolean) {
    const payload = {
        body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
                {
                    amount: {
                        currencyCode: 'USD',
                        value: cart.reduce((sum, item) => sum + item.finalPrice * item.quantity + (isFreeShipping? 0 : (11 * item.quantity)), 0).toString()
                    }
                }
            ]
        }
    }

    try {

        const { body, ...httpResponse } = await ordersController.createOrder(payload);

        const { statusCode, headers } = httpResponse;

        return {
            jsonResponse: JSON.parse(<string>body),
            httpStatusCode: statusCode,
            headers: headers
        }

    } catch (error) {
        console.log("Error from create:", error);

        if (error instanceof ApiError) {
            throw new Error(error.message);
        }

        throw new Error("Goofed");
    }
}

async function capturePayment(orderID: number) {
    const collect = {
        id: `${orderID}`,
        prefer: "return=minimal",
    };

    try {
        const { body, ...httpResponse } = await ordersController.captureOrder(collect);
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return {
            jsonResponse: JSON.parse(<string>body),
            httpStatusCode: httpResponse.statusCode,
        };
    } catch (error) {
        console.log("Error from capture:", error);

        if (error instanceof ApiError) {
            // const { statusCode, headers } = error;
            throw new Error(error.message);
        }

        throw new Error("Goofed");
    }
}

export default router;