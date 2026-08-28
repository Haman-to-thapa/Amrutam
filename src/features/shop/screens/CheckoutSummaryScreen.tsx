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

export function CheckoutSummaryScreen() {
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
            <View style={styles.empty}>
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
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: insets.bottom + 90 },
                ]}>
                {/* Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.title}>Order Summary</Text>
                    <Text style={styles.subtitle}>
                        Review your selected Ayurvedic remedies
                    </Text>
                </View>

                {/* Items Card */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Items in Order</Text>

                    {cartItems.map(item => {
                        const product = productMap.get(item.productId);

                        if (!product) {
                            return null;
                        }

                        return (
                            <View
                                key={item.productId}
                                style={styles.itemRow}>
                                <View style={styles.itemInfo}>
                                    <Text
                                        style={styles.productName}
                                        numberOfLines={1}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.itemQtyPrice}>
                                        Qty: {item.quantity} × ₹{product.price}
                                    </Text>
                                </View>

                                <Text style={styles.productTotal}>
                                    ₹{product.price * item.quantity}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Bill Breakdown Card */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Bill Details</Text>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Item Subtotal</Text>
                        <Text style={styles.totalValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Delivery Fee</Text>
                        <Text style={styles.freeDelivery}>FREE</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Ayurvedic Packaging</Text>
                        <Text style={styles.freeDelivery}>FREE</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.grandTotalLabel}>To Pay</Text>
                        <Text style={styles.grandTotal}>₹{grandTotal.toLocaleString('en-IN')}</Text>
                    </View>
                </View>

                {/* Guarantee Banner */}
                <View style={styles.guaranteeCard}>
                    <Text style={styles.guaranteeIcon}>🌿</Text>
                    <View style={styles.guaranteeContent}>
                        <Text style={styles.guaranteeTitle}>100% Authentic Ayurveda</Text>
                        <Text style={styles.guaranteeText}>
                            Prepared with classical herbs and tested for purity.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                <View style={styles.bottomColumn}>
                    <Text style={styles.bottomLabel}>Total Amount</Text>
                    <Text style={styles.bottomTotal}>₹{grandTotal.toLocaleString('en-IN')}</Text>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Place order"
                    onPress={handlePlaceOrder}
                    style={styles.placeOrderButton}>
                    <Text style={styles.placeOrderText}>Place Order 🛍️</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
        color: '#111827',
    },

    subtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 3,
    },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },

    cardHeader: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },

    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },

    itemInfo: {
        flex: 1,
        marginRight: 12,
    },

    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },

    itemQtyPrice: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },

    productTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },

    divider: {
        height: 1,
        marginVertical: 12,
        backgroundColor: '#e5e7eb',
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },

    totalLabel: {
        fontSize: 14,
        color: '#4b5563',
    },

    totalValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },

    freeDelivery: {
        fontSize: 13,
        fontWeight: '700',
        color: '#15803d',
    },

    grandTotalLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },

    grandTotal: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1f6f43',
    },

    guaranteeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#c8e6c9',
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
        color: '#1b5e20',
    },

    guaranteeText: {
        fontSize: 11,
        color: '#2e7d32',
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
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
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
        color: '#6b7280',
        fontWeight: '600',
    },

    bottomTotal: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },

    placeOrderButton: {
        flex: 1,
        marginLeft: 20,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#1f6f43',
        shadowColor: '#1f6f43',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },

    placeOrderText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});
