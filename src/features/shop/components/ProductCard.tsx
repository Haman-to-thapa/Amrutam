import React, { memo } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { Product } from '../types/shop.types';
import { WishlistButton } from './WishlistButton';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    product: Product;
    onPress?: (product: Product) => void;
};

function ProductCardComponent({ product, onPress }: Props) {
    const { theme } = useAppTheme();

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
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.thumbnailUrl }}
                    style={[
                        styles.image,
                        { backgroundColor: theme.colors.border },
                    ]}
                />
            </View>

            <View style={styles.content}>
                <Text
                    style={[
                        styles.name,
                        { color: theme.colors.text },
                    ]}
                    numberOfLines={2}>
                    {product.name}
                </Text>

                <Text
                    style={[
                        styles.category,
                        { color: theme.colors.textSecondary },
                    ]}>
                    {product.category}
                </Text>

                <Text
                    style={[
                        styles.rating,
                        { color: theme.colors.textSecondary },
                    ]}>
                    ⭐ {product.rating} ({product.reviewCount})
                </Text>

                <Text
                    style={[
                        styles.price,
                        { color: theme.colors.primary },
                    ]}>
                    ₹{product.price}
                </Text>

                {!product.inStock ? (
                    <Text
                        style={[
                            styles.outOfStock,
                            { color: theme.colors.danger },
                        ]}>
                        Out of stock
                    </Text>
                ) : null}
            </View>

            <View style={styles.wishlistWrapper}>
                <WishlistButton product={product} />
            </View>
        </Pressable>
    );
}

export const ProductCard = memo(
    ProductCardComponent,
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

    image: {
        width: 88,
        height: 88,
        borderRadius: 10,
    },

    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },

    name: {
        fontSize: 15,
        fontWeight: '700',
    },

    category: {
        marginTop: 3,
        fontSize: 12,
    },

    rating: {
        marginTop: 3,
        fontSize: 12,
    },

    price: {
        marginTop: 4,
        fontSize: 16,
        fontWeight: '800',
    },

    outOfStock: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '600',
    },

    imageContainer: {
        position: 'relative',
    },

    wishlistWrapper: {
        justifyContent: 'center',
        paddingLeft: 8,
    },
});