import React, { useCallback } from 'react';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import {
    selectCartItemCount,
    selectCartItems,
    selectIsCartHydrated,
} from '@/store/selectors/cartSelectors';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingState } from '@/components/feedback/LoadingState';
import type { ShopStackParamList } from '@/app/navigation/ShopNavigator';
import type { CartItem, Product } from '../types/shop.types';
import { CartItemRow } from '../components/CartItemRow';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/app/providers/ThemeProvider';

export function CartScreen() {
    const { t } = useTranslation();
    const { theme } = useAppTheme();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const navigation =
        useNavigation<NativeStackNavigationProp<ShopStackParamList, 'Cart'>>();

    const cartItems = useAppSelector(selectCartItems);
    const totalCount = useAppSelector(selectCartItemCount);
    const hydrated = useAppSelector(selectIsCartHydrated);

    const handleProductPress = useCallback(
        (product: Product) => {
            navigation.navigate('ProductDetails', {
                productId: product.id,
            });
        },
        [navigation],
    );

    const handleClearCart = useCallback(() => {
        Alert.alert(
            t('common.clear'),
            'Are you sure you want to remove all items from your cart?',
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.clear'),
                    style: 'destructive',
                    onPress: () => dispatch(clearCart()),
                },
            ],
        );
    }, [dispatch, t]);

    const renderItem = useCallback(
        ({ item }: { item: CartItem }) => (
            <CartItemRow
                item={item}
                onPress={handleProductPress}
            />
        ),
        [handleProductPress],
    );

    if (!hydrated) {
        return <LoadingState />;
    }

    if (cartItems.length === 0) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
                <EmptyState
                    title={t('shop.emptyCart')}
                    message={t('shop.emptyCartDesc')}
                />
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Explore shop"
                    onPress={() => navigation.navigate('Products')}
                    style={[styles.exploreButton, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.exploreButtonText}>Explore Remedies →</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Top Bar */}
            <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.itemCountText, { color: theme.colors.text }]}>
                    {totalCount} {t('shop.items')} ({t('shop.cart')})
                </Text>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear cart"
                    onPress={handleClearCart}
                    style={styles.clearButton}>
                    <Text style={[styles.clearButtonText, { color: theme.colors.danger }]}>{t('common.clear')}</Text>
                </Pressable>
            </View>

            {/* List */}
            <FlashList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.productId}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 90 },
                ]}
            />

            {/* Bottom Checkout Bar */}
            <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
                <View style={styles.bottomColumn}>
                    <Text style={[styles.bottomLabel, { color: theme.colors.textSecondary }]}>{t('shop.orderSummary')}</Text>
                    <Text style={[styles.bottomCount, { color: theme.colors.text }]}>({totalCount} {t('shop.items')})</Text>
                </View>

                <Pressable
                    testID="continue-to-checkout-button"
                    accessibilityRole="button"
                    accessibilityLabel="Proceed to checkout"
                    onPress={() => navigation.navigate('Checkout')}
                    style={[styles.checkoutButton, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.checkoutButtonText}>{t('shop.checkout')} →</Text>
                </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    exploreButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        elevation: 3,
    },

    exploreButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },

    itemCountText: {
        fontSize: 13,
        fontWeight: '700',
    },

    clearButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    clearButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },

    listContent: {
        paddingVertical: 8,
    },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 10,
    },

    bottomColumn: {
        justifyContent: 'center',
    },

    bottomLabel: {
        fontSize: 11,
        fontWeight: '600',
    },

    bottomCount: {
        fontSize: 14,
        fontWeight: '700',
    },

    checkoutButton: {
        flex: 1,
        marginLeft: 20,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        elevation: 4,
    },

    checkoutButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});

