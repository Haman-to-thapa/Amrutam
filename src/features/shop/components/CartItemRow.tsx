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

type Props = {
    item: CartItem;
    onPress?: (product: Product) => void;
};

function CartItemRowComponent({ item, onPress }: Props) {
    const dispatch = useAppDispatch();

    const {
        data: product,
        isLoading,
        isError,
    } = useCartProduct(item.productId);

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color="#1f6f43" />
            </View>
        );
    }

    if (isError || !product) {
        return (
            <View style={styles.card}>
                <Text style={styles.errorText}>
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
                    style={styles.removeTag}>
                    <Text style={styles.removeTagText}>
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
            style={styles.card}>
            <Image
                source={{ uri: product.thumbnailUrl }}
                style={styles.image}
                accessibilityLabel={product.name}
            />

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={2}>
                    {product.name}
                </Text>

                <Text style={styles.price}>
                    ₹{product.price}
                </Text>

                <Text style={styles.itemTotal}>
                    Subtotal: ₹{product.price * item.quantity}
                </Text>

                <View style={styles.actions}>
                    <View style={styles.quantityContainer}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Decrease ${product.name} quantity`}
                            onPress={handleDecrease}
                            style={styles.quantityButton}>
                            <Text style={styles.quantityButtonText}>−</Text>
                        </Pressable>

                        <Text style={styles.quantity}>
                            {item.quantity}
                        </Text>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Increase ${product.name} quantity`}
                            disabled={!canIncrease}
                            onPress={handleIncrease}
                            style={[
                                styles.quantityButton,
                                !canIncrease && styles.disabled,
                            ]}>
                            <Text style={styles.quantityButtonText}>+</Text>
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
                        <Text style={styles.removeText}>
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
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
        backgroundColor: '#f3f4f6',
    },

    content: {
        flex: 1,
        marginLeft: 12,
    },

    name: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },

    price: {
        marginTop: 4,
        fontSize: 14,
        color: '#6b7280',
    },

    itemTotal: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
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
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 2,
    },

    quantityButton: {
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

    quantityButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 18,
    },

    disabled: {
        opacity: 0.35,
    },

    quantity: {
        paddingHorizontal: 10,
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
    },

    removeButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    removeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#b91c1c',
    },

    removeTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#fee2e2',
    },

    removeTagText: {
        fontSize: 11,
        color: '#b91c1c',
        fontWeight: '600',
    },

    errorText: {
        fontSize: 13,
        color: '#b91c1c',
        fontWeight: '600',
    },
});
