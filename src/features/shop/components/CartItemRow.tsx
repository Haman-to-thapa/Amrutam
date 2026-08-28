import React, { memo } from 'react';
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

import { useCartProduct } from '../hooks/useCartProducts';
import type { CartItem, Product } from '../types/shop.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    item: CartItem;
    onPress?: (product: Product) => void;
};

function CartItemRowComponent({ item, onPress }: Props) {
    const { theme } = useAppTheme();
    const dispatch = useAppDispatch();

    const {
        data: product,
        isLoading,
        isError,
    } = useCartProduct(item.productId);

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color={theme.colors.primary} />
            </View>
        );
    }

    if (isError || !product) {
        return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.errorText, { color: theme.colors.danger }]}>
                    Product unavailable
                </Text>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remove unavailable product"
                    onPress={() =>
                        dispatch(
                            removeFromCart(item.productId),
                        )
                    }
                    style={[styles.removeTag, { backgroundColor: theme.mode === 'dark' ? '#3b1818' : '#fee2e2' }]}>
                    <Text style={[styles.removeTagText, { color: theme.colors.danger }]}>
                        Remove
                    </Text>
                </Pressable>
            </View>
        );
    }

    const canIncrease =
        product.inStock &&
        item.quantity < product.stockQuantity;

    const handleIncrease = () => {
        if (!canIncrease) {
            dispatch(
                showToast({
                    type: 'warning',
                    message: `Maximum available stock (${product.stockQuantity}) reached.`,
                }),
            );

            return;
        }

        dispatch(
            increaseQuantity(item.productId),
        );
    };

    const handleDecrease = () => {
        dispatch(
            decreaseQuantity(item.productId),
        );
    };

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
            <Image
                source={{ uri: product.thumbnailUrl }}
                style={[styles.image, { backgroundColor: theme.colors.border }]}
                accessibilityLabel={product.name}
            />

            <View style={styles.content}>
                <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
                    {product.name}
                </Text>

                <Text style={[styles.price, { color: theme.colors.textSecondary }]}>
                    ₹{product.price}
                </Text>

                <Text style={[styles.itemTotal, { color: theme.colors.primary }]}>
                    Subtotal: ₹{product.price * item.quantity}
                </Text>

                <View style={styles.actions}>
                    <View style={[styles.quantityContainer, { backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f3f4f6' }]}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Decrease ${product.name} quantity`}
                            onPress={handleDecrease}
                            style={[styles.quantityButton, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.quantityButtonText, { color: theme.colors.text }]}>−</Text>
                        </Pressable>

                        <Text style={[styles.quantity, { color: theme.colors.text }]}>
                            {item.quantity}
                        </Text>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Increase ${product.name} quantity`}
                            disabled={!canIncrease}
                            onPress={handleIncrease}
                            style={[
                                styles.quantityButton,
                                { backgroundColor: theme.colors.surface },
                                !canIncrease && styles.disabled,
                            ]}>
                            <Text style={[styles.quantityButtonText, { color: theme.colors.text }]}>+</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${product.name} from cart`}
                        onPress={() =>
                            dispatch(
                                removeFromCart(item.productId),
                            )
                        }
                        style={styles.removeButton}>
                        <Text style={[styles.removeText, { color: theme.colors.danger }]}>
                            Remove
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}

export const CartItemRow = memo(
    CartItemRowComponent,
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

    loading: {
        minHeight: 110,
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        width: 84,
        height: 84,
        borderRadius: 10,
    },

    content: {
        flex: 1,
        marginLeft: 12,
    },

    name: {
        fontSize: 15,
        fontWeight: '700',
    },

    price: {
        marginTop: 4,
        fontSize: 14,
    },

    itemTotal: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '700',
    },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 2,
    },

    quantityButton: {
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

    quantityButtonText: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 18,
    },

    disabled: {
        opacity: 0.35,
    },

    quantity: {
        paddingHorizontal: 10,
        fontSize: 13,
        fontWeight: '700',
    },

    removeButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    removeText: {
        fontSize: 12,
        fontWeight: '600',
    },

    removeTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },

    removeTagText: {
        fontSize: 11,
        fontWeight: '600',
    },

    errorText: {
        fontSize: 13,
        fontWeight: '600',
    },
});

