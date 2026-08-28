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
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    product: Product;
};

function WishlistButtonComponent({ product }: Props) {
    const { theme } = useAppTheme();
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
                {
                    backgroundColor: isWishlisted
                        ? (theme.mode === 'dark' ? '#3b1818' : '#fee2e2')
                        : theme.colors.surface,
                    borderColor: isWishlisted
                        ? '#fca5a5'
                        : theme.colors.border,
                },
            ]}>
            <Text style={[styles.icon, { color: isWishlisted ? theme.colors.danger : theme.colors.textSecondary }]}>
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
        borderWidth: 1,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    icon: {
        fontSize: 20,
        lineHeight: 22,
    },
});

