import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { ProductListScreen } from '@/features/shop/screens/ProductListScreen';
import { ProductDetailsScreen } from '@/features/shop/screens/ProductDetailsScreen';
import { WishlistScreen } from '@/features/shop/screens/WishlistScreen';
import { CartScreen } from '@/features/shop/screens/CartScreen';
import { CheckoutSummaryScreen } from '@/features/shop/screens/CheckoutSummaryScreen';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/app/providers/ThemeProvider';

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
    const { t } = useTranslation();
    const { theme } = useAppTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                },
                contentStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerShadowVisible: true,
            }}>

            <Stack.Screen
                name="Products"
                component={ProductListScreen}
                options={{ title: t('nav.shop') }}
            />
            <Stack.Screen
                name="ProductDetails"
                component={ProductDetailsScreen}
                options={{ title: t('shop.productDetails') }}
            />
            <Stack.Screen
                name="Wishlist"
                component={WishlistScreen}
                options={{ title: t('shop.wishlist') }}
            />
            <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{ title: t('shop.cart') }}
            />
            <Stack.Screen
                name="Checkout"
                component={CheckoutSummaryScreen}
                options={{ title: t('shop.orderSummary') }}
            />
        </Stack.Navigator>
    );
}



