import { Router } from 'express';
import { Request, Response } from 'express';
import { CartItem } from './cart.model';
import 'express-session';

const router = Router();

// Add item to cart
router.post('/add', (req: Request, res: Response) => {
    const item: CartItem = req.body as CartItem; // Should match CartItem interface
    if (!req.session.cart) req.session.cart = [];
    req.session.cart.push(item);
    res.status(200).json({ message: 'Item added to cart', cart: req.session.cart });
});

// Get all items in cart
router.get('/', (req: Request, res: Response) => {
    res.json(req.session.cart || []);
});

// Remove item from cart by index or ID
router.delete('/remove/:index', (req: Request, res: Response) => {
    const index = parseInt(req.params.index);
    if (!req.session.cart || index < 0 || index >= req.session.cart.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }
    req.session.cart.splice(index, 1);
    res.json({ message: 'Item removed', cart: req.session.cart });
});

// Clear the cart
router.delete('/clear', (req: Request, res: Response) => {
    req.session.cart = [];
    res.json({ message: 'Cart cleared' });
});

export default router;
