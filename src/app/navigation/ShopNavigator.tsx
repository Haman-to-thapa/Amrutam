import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { ProductListScreen } from '@/features/shop/screens/ProductListScreen';
import { ProductDetailsScreen } from '@/features/shop/screens/ProductDetailsScreen';
import { WishlistScreen } from '@/features/shop/screens/WishlistScreen';
import { CartScreen } from '@/features/shop/screens/CartScreen';
import { CheckoutSummaryScreen } from '@/features/shop/screens/CheckoutSummaryScreen';

export type ShopStackParamList = {
    Products: undefined;
    ProductDetails: {
        productId: string;
    };
    Wishlist: undefined;
    Cart: undefined;
    Checkout: undefined;
};

const Stack =
    createNativeStackNavigator<ShopStackParamList>();

export function ShopNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#ffffff',
                },
                headerTintColor: '#111827',
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                },
                headerShadowVisible: true,
            }}>
            <Stack.Screen
                name="Products"
                component={ProductListScreen}
                options={{ title: 'Shop' }}
            />
            <Stack.Screen
                name="ProductDetails"
                component={ProductDetailsScreen}
                options={{ title: 'Product Details' }}
            />
            <Stack.Screen
                name="Wishlist"
                component={WishlistScreen}
                options={{ title: 'My Wishlist' }}
            />
            <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{ title: 'Shopping Cart' }}
            />
            <Stack.Screen
                name="Checkout"
                component={CheckoutSummaryScreen}
                options={{ title: 'Checkout Summary' }}
            />
        </Stack.Navigator>
    );
}



