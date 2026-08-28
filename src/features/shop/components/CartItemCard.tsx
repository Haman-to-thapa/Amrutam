import React, { memo, useCallback } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAppDispatch } from '@/store/hooks';
import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
} from '@/store/slices/cartSlice';
import { showToast } from '@/store/slices/toastSlice';
import { useProductDetails } from '../hooks/useProductDetails';
import type { CartItem, Product } from '../types/shop.types';

type Props = {
    item: CartItem;
    onPress?: (product: Product) => void;
};

function CartItemCardComponent({ item, onPress }: Props) {
    const dispatch = useAppDispatch();
    const { data: product, isLoading, isError } = useProductDetails(item.productId);

    const handleIncrease = useCallback(() => {
        if (product && item.quantity >= product.stockQuantity) {
            dispatch(
                showToast({
                    type: 'warning',
                    message: `Only ${product.stockQuantity} items in stock.`,
                }),
            );
            return;
        }

        dispatch(increaseQuantity(item.productId));
    }, [dispatch, item.productId, item.quantity, product]);

    const handleDecrease = useCallback(() => {
        dispatch(decreaseQuantity(item.productId));
    }, [dispatch, item.productId]);

    const handleRemove = useCallback(() => {
        dispatch(removeFromCart(item.productId));
        dispatch(
            showToast({
                type: 'info',
                message: 'Item removed from cart.',
            }),
        );
    }, [dispatch, item.productId]);

    if (isLoading) {
        return (
            <View style={[styles.card, styles.loadingCard]}>
                <ActivityIndicator size="small" color="#1f6f43" />
                <Text style={styles.loadingText}>Loading item...</Text>
            </View>
        );
    }

    if (isError || !product) {
        return (
            <View style={[styles.card, styles.errorCard]}>
                <Text style={styles.errorText}>Product unavailable or removed</Text>
                <Pressable
                    onPress={handleRemove}
                    accessibilityRole="button"
                    style={styles.removeTag}>
                    <Text style={styles.removeTagText}>Remove</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${product.name}`}
            onPress={() => onPress?.(product)}
            style={styles.card}>
            {/* Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.thumbnailUrl }}
                    style={styles.image}
                />
            </View>

            {/* Details */}
            <View style={styles.details}>
                <View style={styles.headerRow}>
                    <Text style={styles.category}>{product.category}</Text>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Remove item"
                        onPress={handleRemove}
                        style={styles.deleteButton}>
                        <Text style={styles.deleteIcon}>✕</Text>
                    </Pressable>
                </View>

                <Text style={styles.name} numberOfLines={2}>
                    {product.name}
                </Text>

                <View style={styles.priceRow}>
                    <Text style={styles.unitPrice}>₹{product.price}</Text>
                    <Text style={styles.totalPrice}>
                        Subtotal: ₹{product.price * item.quantity}
                    </Text>
                </View>

                {/* Quantity Stepper */}
                <View style={styles.stepperContainer}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Decrease quantity"
                        onPress={handleDecrease}
                        style={styles.stepperButton}>
                        <Text style={styles.stepperButtonText}>−</Text>
                    </Pressable>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Increase quantity"
                        onPress={handleIncrease}
                        disabled={product.stockQuantity <= item.quantity}
                        style={[
                            styles.stepperButton,
                            product.stockQuantity <= item.quantity &&
                            styles.disabledStepperButton,
                        ]}>
                        <Text style={styles.stepperButtonText}>+</Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}

export const CartItemCard = memo(
    CartItemCardComponent,
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    loadingCard: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    loadingText: {
        fontSize: 12,
        color: '#6b7280',
    },

    errorCard: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    errorText: {
        fontSize: 13,
        color: '#b91c1c',
        fontWeight: '500',
    },

    removeTag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        backgroundColor: '#fee2e2',
    },

    removeTagText: {
        fontSize: 11,
        color: '#b91c1c',
        fontWeight: '600',
    },

    imageContainer: {
        width: 88,
        height: 88,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    details: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    category: {
        fontSize: 11,
        color: '#1f6f43',
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    deleteButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },

    deleteIcon: {
        fontSize: 11,
        color: '#6b7280',
        fontWeight: '800',
    },

    name: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginTop: 2,
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },

    unitPrice: {
        fontSize: 14,
        color: '#6b7280',
    },

    totalPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },

    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 2,
        marginTop: 8,
    },

    stepperButton: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },

    disabledStepperButton: {
        opacity: 0.4,
    },

    stepperButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 18,
    },

    quantityText: {
        paddingHorizontal: 12,
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
    },
});
