import React, { useMemo } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import { selectCartItems } from '@/store/selectors/cartSelectors';
import { showToast } from '@/store/slices/toastSlice';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import type { ShopStackParamList } from '@/app/navigation/ShopNavigator';
import { calculateSubtotal } from '../utils/cartUtils';
import { useCartProducts } from '../hooks/useCartProducts';
import { useAppTheme } from '@/app/providers/ThemeProvider';

export function CheckoutSummaryScreen() {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const navigation =
        useNavigation<NativeStackNavigationProp<ShopStackParamList, 'Checkout'>>();

    const cartItems = useAppSelector(selectCartItems);

    const productIds = useMemo(
        () => cartItems.map(item => item.productId),
        [cartItems],
    );

    const {
        data: products = [],
        isLoading,
        isError,
        refetch,
    } = useCartProducts(productIds);

    const productMap = useMemo(
        () =>
            new Map(
                products.map(product => [
                    product.id,
                    product,
                ]),
            ),
        [products],
    );

    const subtotal = useMemo(
        () => calculateSubtotal(cartItems, products),
        [cartItems, products],
    );

    const handlePlaceOrder = () => {
        Alert.alert(
            'Order Confirmed 🎉',
            `Your Ayurvedic order of ₹${subtotal.toLocaleString('en-IN')} has been placed successfully!`,
            [
                {
                    text: 'Continue Shopping',
                    onPress: () => {
                        dispatch(clearCart());
                        dispatch(
                            showToast({
                                type: 'success',
                                message: 'Order placed successfully!',
                            }),
                        );
                        navigation.navigate('Products');
                    },
                },
            ],
        );
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return (
            <ErrorState
                message="Unable to load checkout details."
                onRetry={refetch}
            />
        );
    }

    if (cartItems.length === 0) {
        return (
            <View style={[styles.empty, { backgroundColor: theme.colors.background }]}>
                <EmptyState
                    title="No items to checkout"
                    message="Your cart is currently empty."
                />
            </View>
        );
    }

    const deliveryFee = 0;
    const grandTotal = subtotal + deliveryFee;

    return (
        <View testID="checkout-summary-container" style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: insets.bottom + 90 },
                ]}>
                {/* Header */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Order Summary</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        Review your selected Ayurvedic remedies
                    </Text>
                </View>

                {/* Items Card */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.cardHeader, { color: theme.colors.text }]}>Items in Order</Text>

                    {cartItems.map(item => {
                        const product = productMap.get(item.productId);

                        if (!product) {
                            return null;
                        }

                        return (
                            <View
                                key={item.productId}
                                style={[styles.itemRow, { borderBottomColor: theme.colors.border }]}>
                                <View style={styles.itemInfo}>
                                    <Text
                                        style={[styles.productName, { color: theme.colors.text }]}
                                        numberOfLines={1}>
                                        {product.name}
                                    </Text>
                                    <Text style={[styles.itemQtyPrice, { color: theme.colors.textSecondary }]}>
                                        Qty: {item.quantity} × ₹{product.price}
                                    </Text>
                                </View>

                                <Text style={[styles.productTotal, { color: theme.colors.primary }]}>
                                    ₹{product.price * item.quantity}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Bill Breakdown Card */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.cardHeader, { color: theme.colors.text }]}>Bill Details</Text>

                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Item Subtotal</Text>
                        <Text style={[styles.totalValue, { color: theme.colors.text }]}>₹{subtotal.toLocaleString('en-IN')}</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Delivery Fee</Text>
                        <Text style={[styles.freeDelivery, { color: theme.colors.primary }]}>FREE</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Ayurvedic Packaging</Text>
                        <Text style={[styles.freeDelivery, { color: theme.colors.primary }]}>FREE</Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                    <View style={styles.totalRow}>
                        <Text style={[styles.grandTotalLabel, { color: theme.colors.text }]}>To Pay</Text>
                        <Text style={[styles.grandTotal, { color: theme.colors.primary }]}>₹{grandTotal.toLocaleString('en-IN')}</Text>
                    </View>
                </View>

                {/* Guarantee Banner */}
                <View style={[styles.guaranteeCard, { backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9', borderColor: theme.mode === 'dark' ? '#2d573d' : '#c8e6c9' }]}>
                    <Text style={styles.guaranteeIcon}>🌿</Text>
                    <View style={styles.guaranteeContent}>
                        <Text style={[styles.guaranteeTitle, { color: theme.colors.primary }]}>100% Authentic Ayurveda</Text>
                        <Text style={[styles.guaranteeText, { color: theme.mode === 'dark' ? '#a7f3d0' : '#2e7d32' }]}>
                            Prepared with classical herbs and tested for purity.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
                <View style={styles.bottomColumn}>
                    <Text style={[styles.bottomLabel, { color: theme.colors.textSecondary }]}>Total Amount</Text>
                    <Text style={[styles.bottomTotal, { color: theme.colors.text }]}>₹{grandTotal.toLocaleString('en-IN')}</Text>
                </View>

                <Pressable
                    testID="place-order-button"
                    accessibilityRole="button"
                    accessibilityLabel="Place order"
                    onPress={handlePlaceOrder}
                    style={[styles.placeOrderButton, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.placeOrderText}>Place Order 🛍️</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        padding: 16,
    },

    sectionHeader: {
        marginBottom: 16,
    },

    title: {
        fontSize: 22,
        fontWeight: '800',
    },

    subtitle: {
        fontSize: 13,
        marginTop: 3,
    },

    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
    },

    cardHeader: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 12,
    },

    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 9,
        borderBottomWidth: 1,
    },

    itemInfo: {
        flex: 1,
        marginRight: 12,
    },

    productName: {
        fontSize: 14,
        fontWeight: '600',
    },

    itemQtyPrice: {
        fontSize: 12,
        marginTop: 2,
    },

    productTotal: {
        fontSize: 14,
        fontWeight: '700',
    },

    divider: {
        height: 1,
        marginVertical: 12,
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },

    totalLabel: {
        fontSize: 14,
    },

    totalValue: {
        fontSize: 14,
        fontWeight: '600',
    },

    freeDelivery: {
        fontSize: 13,
        fontWeight: '700',
    },

    grandTotalLabel: {
        fontSize: 16,
        fontWeight: '800',
    },

    grandTotal: {
        fontSize: 18,
        fontWeight: '800',
    },

    guaranteeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        padding: 14,
        borderRadius: 14,
    },

    guaranteeIcon: {
        fontSize: 22,
        marginRight: 12,
    },

    guaranteeContent: {
        flex: 1,
    },

    guaranteeTitle: {
        fontSize: 13,
        fontWeight: '700',
    },

    guaranteeText: {
        fontSize: 11,
        marginTop: 2,
    },

    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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

    bottomTotal: {
        fontSize: 20,
        fontWeight: '800',
    },

    placeOrderButton: {
        flex: 1,
        marginLeft: 20,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        elevation: 4,
    },

    placeOrderText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});

