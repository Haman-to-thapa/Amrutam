import { calculateSubtotal } from './cartUtils';
import type { CartItem, Product } from '../types/shop.types';

describe('calculateSubtotal', () => {
    it('calculates subtotal correctly for multiple products with different quantities', () => {
        const items: CartItem[] = [
            {
                productId: 'product-1',
                quantity: 2,
                addedAt: '2026-08-28T00:00:00.000Z',
            },
            {
                productId: 'product-2',
                quantity: 1,
                addedAt: '2026-08-28T00:00:00.000Z',
            },
        ];

        const products: Product[] = [
            {
                id: 'product-1',
                name: 'Product One',
                description: '',
                shortDescription: '',
                category: 'Wellness',
                price: 500,
                currency: 'INR',
                rating: 4.5,
                reviewCount: 10,
                imageUrl: '',
                thumbnailUrl: '',
                inStock: true,
                stockQuantity: 10,
                tags: [],
            },
            {
                id: 'product-2',
                name: 'Product Two',
                description: '',
                shortDescription: '',
                category: 'Supplements',
                price: 300,
                currency: 'INR',
                rating: 4,
                reviewCount: 5,
                imageUrl: '',
                thumbnailUrl: '',
                inStock: true,
                stockQuantity: 10,
                tags: [],
            },
        ];

        expect(calculateSubtotal(items, products)).toBe(1300);
    });

    it('ignores unknown or missing products safely without crashing', () => {
        const items: CartItem[] = [
            {
                productId: 'missing-product',
                quantity: 2,
                addedAt: '2026-08-28T00:00:00.000Z',
            },
        ];

        expect(calculateSubtotal(items, [])).toBe(0);
    });

    it('returns 0 when cart is empty', () => {
        expect(calculateSubtotal([], [])).toBe(0);
    });
});
