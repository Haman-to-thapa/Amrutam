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
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    item: CartItem;
    onPress?: (product: Product) => void;
};

function CartItemCardComponent({ item, onPress }: Props) {
    const { theme } = useAppTheme();
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
            <View style={[styles.card, styles.loadingCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading item...</Text>
            </View>
        );
    }

    if (isError || !product) {
        return (
            <View style={[styles.card, styles.errorCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.errorText, { color: theme.colors.danger }]}>Product unavailable or removed</Text>
                <Pressable
                    onPress={handleRemove}
                    accessibilityRole="button"
                    style={[styles.removeTag, { backgroundColor: theme.mode === 'dark' ? '#3b1818' : '#fee2e2' }]}>
                    <Text style={[styles.removeTagText, { color: theme.colors.danger }]}>Remove</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${product.name}`}
            onPress={() => onPress?.(product)}
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
            ]}>
            {/* Image */}
            <View style={[styles.imageContainer, { backgroundColor: theme.colors.border }]}>
                <Image
                    source={{ uri: product.thumbnailUrl }}
                    style={styles.image}
                />
            </View>

            {/* Details */}
            <View style={styles.details}>
                <View style={styles.headerRow}>
                    <Text style={[styles.category, { color: theme.colors.primary }]}>{product.category}</Text>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Remove item"
                        onPress={handleRemove}
                        style={[styles.deleteButton, { backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f3f4f6' }]}>
                        <Text style={[styles.deleteIcon, { color: theme.colors.textSecondary }]}>✕</Text>
                    </Pressable>
                </View>

                <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
                    {product.name}
                </Text>

                <View style={styles.priceRow}>
                    <Text style={[styles.unitPrice, { color: theme.colors.textSecondary }]}>₹{product.price}</Text>
                    <Text style={[styles.totalPrice, { color: theme.colors.primary }]}>
                        Subtotal: ₹{product.price * item.quantity}
                    </Text>
                </View>

                {/* Quantity Stepper */}
                <View style={[styles.stepperContainer, { backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f3f4f6' }]}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Decrease quantity"
                        onPress={handleDecrease}
                        style={[styles.stepperButton, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.stepperButtonText, { color: theme.colors.text }]}>−</Text>
                    </Pressable>

                    <Text style={[styles.quantityText, { color: theme.colors.text }]}>{item.quantity}</Text>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Increase quantity"
                        onPress={handleIncrease}
                        disabled={product.stockQuantity <= item.quantity}
                        style={[
                            styles.stepperButton,
                            { backgroundColor: theme.colors.surface },
                            product.stockQuantity <= item.quantity &&
                            styles.disabledStepperButton,
                        ]}>
                        <Text style={[styles.stepperButtonText, { color: theme.colors.text }]}>+</Text>
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
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
    },

    loadingCard: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    loadingText: {
        fontSize: 12,
    },

    errorCard: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    errorText: {
        fontSize: 13,
        fontWeight: '500',
    },

    removeTag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },

    removeTagText: {
        fontSize: 11,
        fontWeight: '600',
    },

    imageContainer: {
        width: 88,
        height: 88,
        borderRadius: 10,
        overflow: 'hidden',
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
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    deleteButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    deleteIcon: {
        fontSize: 11,
        fontWeight: '800',
    },

    name: {
        fontSize: 14,
        fontWeight: '700',
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
    },

    totalPrice: {
        fontSize: 14,
        fontWeight: '700',
    },

    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 8,
        padding: 2,
        marginTop: 8,
    },

    stepperButton: {
        width: 28,
        height: 28,
        borderRadius: 6,
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
        lineHeight: 18,
    },

    quantityText: {
        paddingHorizontal: 12,
        fontSize: 13,
        fontWeight: '700',
    },
});

