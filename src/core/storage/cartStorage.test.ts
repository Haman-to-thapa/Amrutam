import type { CartItem } from '@/features/shop/types/shop.types';
import { clearStoredCart, loadCart, saveCart } from './cartStorage';

describe('cartStorage contract & persistence', () => {
    it('uses valid cart item schema', () => {
        const item: CartItem = {
            productId: 'product-1',
            quantity: 2,
            addedAt: '2026-08-28T00:00:00.000Z',
        };

        expect(item.productId).toBe('product-1');
        expect(item.quantity).toBe(2);
        expect(item.addedAt).toBeDefined();
    });

    it('saves and loads cart items via storage service', () => {
        const items: CartItem[] = [
            {
                productId: 'product-101',
                quantity: 3,
                addedAt: '2026-08-28T00:00:00.000Z',
            },
        ];

        saveCart(items);
        const loaded = loadCart();
        expect(loaded).toEqual(items);
    });

    it('clears stored cart items', () => {
        saveCart([
            {
                productId: 'product-102',
                quantity: 1,
                addedAt: '2026-08-28T00:00:00.000Z',
            },
        ]);

        clearStoredCart();
        const loaded = loadCart();
        expect(loaded).toEqual([]);
    });
});
