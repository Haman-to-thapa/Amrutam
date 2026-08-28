import type { CartItem, Product } from '../types/shop.types';

export function calculateSubtotal(
    items: CartItem[],
    products: Product[],
): number {
    const priceMap = new Map(
        products.map(product => [
            product.id,
            product.price,
        ]),
    );

    return items.reduce((total, item) => {
        const price = priceMap.get(item.productId) ?? 0;

        return total + price * item.quantity;
    }, 0);
}
