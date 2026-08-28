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
import { removeFromWishlist } from '@/store/slices/wishlistSlice';
import { useProductDetails } from '../hooks/useProductDetails';
import type { Product } from '../types/shop.types';

type Props = {
    productId: string;
    onPress?: (product: Product) => void;
};

function WishlistItemCardComponent({ productId, onPress }: Props) {
    const dispatch = useAppDispatch();
    const { data: product, isLoading, isError } = useProductDetails(productId);

    const handleRemove = useCallback(() => {
        dispatch(removeFromWishlist(productId));
    }, [dispatch, productId]);

    if (isLoading) {
        return (
            <View style={[styles.card, styles.loadingCard]}>
                <ActivityIndicator size="small" color="#1f6f43" />
                <Text style={styles.loadingText}>Loading item details...</Text>
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

    const discount =
        product.originalPrice && product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${product.name}`}
            onPress={() => onPress?.(product)}
            style={styles.card}>
            {/* Thumbnail */}
            <View style={styles.imageContainer}>
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
                    <Text style={styles.category}>{product.category}</Text>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Remove from wishlist"
                        onPress={handleRemove}
                        style={styles.heartButton}>
                        <Text style={styles.heartIcon}>♥</Text>
                    </Pressable>
                </View>

                <Text style={styles.name} numberOfLines={2}>
                    {product.name}
                </Text>

                <Text style={styles.rating}>
                    ⭐ {product.rating} ({product.reviewCount})
                </Text>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{product.price}</Text>
                    {product.originalPrice ? (
                        <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                    ) : null}
                    {discount > 0 ? (
                        <Text style={styles.discountText}>{discount}% OFF</Text>
                    ) : null}
                </View>

                {/* Add to Cart Button */}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                        product.inStock ? 'Add product to cart' : 'Product out of stock'
                    }
                    disabled={!product.inStock}
                    style={[
                        styles.cartButton,
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
        position: 'relative',
        width: 96,
        height: 96,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
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
        color: '#1f6f43',
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    heartButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fee2e2',
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
        color: '#111827',
        marginTop: 2,
    },

    rating: {
        fontSize: 11,
        color: '#4b5563',
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
        color: '#111827',
    },

    originalPrice: {
        fontSize: 12,
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },

    discountText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#dc2626',
    },

    cartButton: {
        marginTop: 8,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#1f6f43',
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
