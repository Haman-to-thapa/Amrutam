import reducer, {
    addToCart,
    clearCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
} from './cartSlice';

describe('cartSlice', () => {
    const item = {
        productId: 'product-1',
        quantity: 1,
        addedAt: '2026-08-28T00:00:00.000Z',
    };

    it('adds a new product to cart', () => {
        const state = reducer(
            undefined,
            addToCart(item),
        );

        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(1);
        expect(state.items[0].productId).toBe('product-1');
    });

    it('increments quantity when adding same product again', () => {
        let state = reducer(
            undefined,
            addToCart(item),
        );

        state = reducer(
            state,
            addToCart({
                productId: 'product-1',
                quantity: 2,
                addedAt: '2026-08-28T00:00:00.000Z',
            }),
        );

        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(3);
    });

    it('increases quantity with increaseQuantity', () => {
        let state = reducer(
            undefined,
            addToCart(item),
        );

        state = reducer(
            state,
            increaseQuantity('product-1'),
        );

        expect(state.items[0].quantity).toBe(2);
    });

    it('decreases quantity with decreaseQuantity', () => {
        const initialState = {
            items: [
                {
                    productId: 'product-1',
                    quantity: 3,
                    addedAt: '2026-08-28T00:00:00.000Z',
                },
            ],
        };

        const state = reducer(
            initialState,
            decreaseQuantity('product-1'),
        );

        expect(state.items[0].quantity).toBe(2);
    });

    it('removes item when quantity decreases from 1', () => {
        const state = reducer(
            {
                items: [item],
            },
            decreaseQuantity('product-1'),
        );

        expect(state.items).toHaveLength(0);
    });

    it('removes product with removeFromCart', () => {
        const state = reducer(
            {
                items: [item],
            },
            removeFromCart('product-1'),
        );

        expect(state.items).toHaveLength(0);
    });

    it('clears all items with clearCart', () => {
        const state = reducer(
            {
                items: [
                    item,
                    { productId: 'product-2', quantity: 2, addedAt: '2026-08-28T00:00:00.000Z' },
                ],
            },
            clearCart(),
        );

        expect(state.items).toHaveLength(0);
    });
});
