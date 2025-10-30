export interface CartItem {
    productId: number;
    name: string;
    basePrice: number;
    selectedOptions: { [key: string]: string };
    finalPrice: number;
    quantity: number;
}