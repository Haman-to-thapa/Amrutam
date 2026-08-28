import React, { memo, useCallback } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    addToWishlist,
    removeFromWishlist,
} from '@/store/slices/wishlistSlice';
import { selectIsProductWishlisted } from '@/store/selectors/wishlistSelectors';
import type { Product } from '../types/shop.types';

type Props = {
    product: Product;
};

function WishlistButtonComponent({ product }: Props) {
    const dispatch = useAppDispatch();

    const isWishlisted = useAppSelector(
        selectIsProductWishlisted(product.id),
    );

    const handlePress = useCallback(() => {
        if (isWishlisted) {
            dispatch(removeFromWishlist(product.id));
            return;
        }

        dispatch(
            addToWishlist({
                productId: product.id,
                addedAt: new Date().toISOString(),
            }),
        );
    }, [dispatch, isWishlisted, product.id]);

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={
                isWishlisted
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
            }
            onPress={handlePress}
            style={[
                styles.button,
                isWishlisted && styles.activeButton,
            ]}>
            <Text style={[styles.icon, isWishlisted && styles.activeIcon]}>
                {isWishlisted ? '♥' : '♡'}
            </Text>
        </Pressable>
    );
}

export const WishlistButton = memo(
    WishlistButtonComponent,
);

const styles = StyleSheet.create({
    button: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 19,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },

    activeButton: {
        backgroundColor: '#fee2e2',
        borderColor: '#fca5a5',
    },

    icon: {
        fontSize: 20,
        color: '#6b7280',
        lineHeight: 22,
    },

    activeIcon: {
        color: '#dc2626',
    },
});
