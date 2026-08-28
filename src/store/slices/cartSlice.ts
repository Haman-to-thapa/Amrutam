import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CartItem } from '@/features/shop/types/shop.types';

type CartState = {
    items: CartItem[];
};

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<CartItem>) {
            const existingItem = state.items.find(
                item => item.productId === action.payload.productId,
            );

            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
                return;
            }

            state.items.push(action.payload);
        },

        increaseQuantity(
            state,
            action: PayloadAction<string>,
        ) {
            const item = state.items.find(
                cartItem => cartItem.productId === action.payload,
            );

            if (item) {
                item.quantity += 1;
            }
        },

        decreaseQuantity(
            state,
            action: PayloadAction<string>,
        ) {
            const item = state.items.find(
                cartItem => cartItem.productId === action.payload,
            );

            if (!item) {
                return;
            }

            if (item.quantity <= 1) {
                state.items = state.items.filter(
                    cartItem =>
                        cartItem.productId !== action.payload,
                );
                return;
            }

            item.quantity -= 1;
        },

        removeFromCart(
            state,
            action: PayloadAction<string>,
        ) {
            state.items = state.items.filter(
                item => item.productId !== action.payload,
            );
        },

        clearCart(state) {
            state.items = [];
        },

        setCart(
            state,
            action: PayloadAction<CartItem[]>,
        ) {
            state.items = action.payload;
        },
    },
});

export const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
