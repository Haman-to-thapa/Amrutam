import React, { memo } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { Product } from '../types/shop.types';

type Props = {
    product: Product;
    onPress?: (product: Product) => void;
};

function ProductCardComponent({ product, onPress }: Props) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${product.name}`}
            onPress={() => onPress?.(product)}
            style={styles.card}>
            <Image
                source={{ uri: product.thumbnailUrl }}
                style={styles.image}
            />

            <View style={styles.content}>
                <Text
                    style={styles.name}
                    numberOfLines={2}>
                    {product.name}
                </Text>

                <Text style={styles.category}>
                    {product.category}
                </Text>

                <Text style={styles.rating}>
                    ⭐ {product.rating} ({product.reviewCount})
                </Text>

                <Text style={styles.price}>
                    ₹{product.price}
                </Text>

                {!product.inStock ? (
                    <Text style={styles.outOfStock}>
                        Out of stock
                    </Text>
                ) : null}
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
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },

    image: {
        width: 88,
        height: 88,
        borderRadius: 10,
        backgroundColor: '#eee',
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
        marginTop: 4,
        fontSize: 12,
    },

    rating: {
        marginTop: 4,
        fontSize: 12,
    },

    price: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '700',
    },

    outOfStock: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '600',
    },
});