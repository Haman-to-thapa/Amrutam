import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { ProductListScreen } from '@/features/shop/screens/ProductListScreen';
import { ProductDetailsScreen } from '@/features/shop/screens/ProductDetailsScreen';
import { WishlistScreen } from '@/features/shop/screens/WishlistScreen';

export type ShopStackParamList = {
    Products: undefined;
    ProductDetails: {
        productId: string;
    };
    Wishlist: undefined;
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
        </Stack.Navigator>
    );
}

