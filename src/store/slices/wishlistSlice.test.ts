import reducer, {
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    setWishlistHydrated,
} from './wishlistSlice';

describe('wishlistSlice', () => {
    it('adds a product only once (duplicate protection)', () => {
        const item = {
            productId: 'product-1',
            addedAt: '2026-08-28T00:00:00.000Z',
        };

        let state = reducer(
            undefined,
            addToWishlist(item),
        );

        state = reducer(
            state,
            addToWishlist(item),
        );

        expect(state.items).toHaveLength(1);
        expect(state.items[0].productId).toBe('product-1');
    });

    it('removes a product from wishlist', () => {
        const initialState = {
            items: [
                {
                    productId: 'product-1',
                    addedAt: '2026-08-28T00:00:00.000Z',
                },
            ],
            hydrated: true,
        };

        const state = reducer(
            initialState,
            removeFromWishlist('product-1'),
        );

        expect(state.items).toHaveLength(0);
    });

    it('clears all items from wishlist', () => {
        const initialState = {
            items: [
                { productId: 'product-1', addedAt: '2026-08-28T00:00:00.000Z' },
                { productId: 'product-2', addedAt: '2026-08-28T00:00:00.000Z' },
            ],
            hydrated: true,
        };

        const state = reducer(initialState, clearWishlist());
        expect(state.items).toHaveLength(0);
    });

    it('sets hydrated items', () => {
        const persistedItems = [
            { productId: 'product-99', addedAt: '2026-08-28T00:00:00.000Z' },
        ];

        const state = reducer(undefined, setWishlistHydrated(persistedItems));
        expect(state.hydrated).toBe(true);
        expect(state.items).toHaveLength(1);
        expect(state.items[0].productId).toBe('product-99');
    });
});
