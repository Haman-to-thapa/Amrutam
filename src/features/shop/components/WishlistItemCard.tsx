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
import { addToCart } from '@/store/slices/cartSlice';
import { removeFromWishlist } from '@/store/slices/wishlistSlice';
import { showToast } from '@/store/slices/toastSlice';
import { useProductDetails } from '../hooks/useProductDetails';
import type { Product } from '../types/shop.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    productId: string;
    onPress?: (product: Product) => void;
};

function WishlistItemCardComponent({ productId, onPress }: Props) {
    const { theme } = useAppTheme();
    const dispatch = useAppDispatch();
    const { data: product, isLoading, isError } = useProductDetails(productId);

    const handleRemove = useCallback(() => {
        dispatch(removeFromWishlist(productId));
    }, [dispatch, productId]);

    const handleAddToCart = useCallback(() => {
        if (!product || !product.inStock || product.stockQuantity <= 0) {
            dispatch(
                showToast({
                    type: 'warning',
                    message: 'This product is out of stock.',
                }),
            );
            return;
        }

        dispatch(
            addToCart({
                productId: product.id,
                quantity: 1,
                addedAt: new Date().toISOString(),
            }),
        );

        dispatch(
            showToast({
                type: 'success',
                message: `Added ${product.name} to cart.`,
            }),
        );
    }, [dispatch, product]);


    if (isLoading) {
        return (
            <View style={[styles.card, styles.loadingCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading item details...</Text>
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

    const discount =
        product.originalPrice && product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

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
            {/* Thumbnail */}
            <View style={[styles.imageContainer, { backgroundColor: theme.colors.border }]}>
                <Image
                    source={{ uri: product.thumbnailUrl }}
                    style={styles.image}
                />
                {!product.inStock ? (
                    <View style={styles.outOfStockBadge}>
                        <Text style={styles.outOfStockText}>Out of stock</Text>
                    </View>
                ) : null}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={[styles.category, { color: theme.colors.primary }]}>{product.category}</Text>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Remove from wishlist"
                        onPress={handleRemove}
                        style={[styles.heartButton, { backgroundColor: theme.mode === 'dark' ? '#3b1818' : '#fee2e2' }]}>
                        <Text style={styles.heartIcon}>♥</Text>
                    </Pressable>
                </View>

                <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
                    {product.name}
                </Text>

                <Text style={[styles.rating, { color: theme.colors.textSecondary }]}>
                    ⭐ {product.rating} ({product.reviewCount})
                </Text>

                <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: theme.colors.primary }]}>₹{product.price}</Text>
                    {product.originalPrice ? (
                        <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>₹{product.originalPrice}</Text>
                    ) : null}
                    {discount > 0 ? (
                        <Text style={[styles.discountText, { color: theme.colors.danger }]}>{discount}% OFF</Text>
                    ) : null}
                </View>

                {/* Add to Cart Button */}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                        product.inStock ? 'Add product to cart' : 'Product out of stock'
                    }
                    disabled={!product.inStock}
                    onPress={handleAddToCart}
                    style={[
                        styles.cartButton,
                        { backgroundColor: theme.colors.primary },
                        !product.inStock && styles.disabledCartButton,
                    ]}>
                    <Text style={styles.cartButtonText}>
                        {product.inStock ? '🛍️ Add to Cart' : 'Out of Stock'}
                    </Text>
                </Pressable>

            </View>
        </Pressable>
    );
}

export const WishlistItemCard = memo(
    WishlistItemCardComponent,
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
        position: 'relative',
        width: 96,
        height: 96,
        borderRadius: 10,
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    outOfStockBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(185, 28, 28, 0.85)',
        paddingVertical: 2,
        alignItems: 'center',
    },

    outOfStockText: {
        color: '#ffffff',
        fontSize: 9,
        fontWeight: '700',
    },

    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    category: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    heartButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    heartIcon: {
        fontSize: 15,
        color: '#dc2626',
        lineHeight: 17,
    },

    name: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 2,
    },

    rating: {
        fontSize: 11,
        marginTop: 2,
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },

    price: {
        fontSize: 15,
        fontWeight: '800',
    },

    originalPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
    },

    discountText: {
        fontSize: 11,
        fontWeight: '700',
    },

    cartButton: {
        marginTop: 8,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },

    disabledCartButton: {
        backgroundColor: '#9ca3af',
    },

    cartButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
});

