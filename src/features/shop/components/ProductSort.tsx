import React, { memo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ProductSortOption } from '../types/shop.types';

const OPTIONS: readonly {
    value: ProductSortOption;
    label: string;
    icon: string;
}[] = [
        {
            value: 'relevance',
            label: 'Popular',
            icon: '⚡',
        },
        {
            value: 'price_low_to_high',
            label: 'Price: Low to High',
            icon: '📉',
        },
        {
            value: 'price_high_to_low',
            label: 'Price: High to Low',
            icon: '📈',
        },
        {
            value: 'rating_high_to_low',
            label: 'Top Rated',
            icon: '⭐',
        },
        {
            value: 'newest',
            label: 'Newest',
            icon: '✨',
        },
    ];

type Props = {
    value: ProductSortOption;
    inStockOnly: boolean;
    onChange: (value: ProductSortOption) => void;
    onStockToggle: (inStock: boolean) => void;
};

function ProductSortComponent({
    value,
    inStockOnly,
    onChange,
    onStockToggle,
}: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}>
            {/* In-Stock Toggle Chip */}
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Toggle in-stock filter"
                onPress={() => onStockToggle(!inStockOnly)}
                style={[
                    styles.chip,
                    inStockOnly ? styles.inStockActiveChip : styles.inactiveChip,
                ]}>
                <View
                    style={[
                        styles.dot,
                        inStockOnly ? styles.activeDot : styles.inactiveDot,
                    ]}
                />
                <Text
                    style={[
                        styles.text,
                        inStockOnly ? styles.inStockActiveText : styles.inactiveText,
                    ]}>
                    In Stock
                </Text>
            </Pressable>

            {/* Sort Chips */}
            {OPTIONS.map(option => {
                const active = option.value === value;

                return (
                    <Pressable
                        key={option.value}
                        accessibilityRole="button"
                        accessibilityLabel={`Sort by ${option.label}`}
                        onPress={() => onChange(option.value)}
                        style={[
                            styles.chip,
                            active ? styles.activeChip : styles.inactiveChip,
                        ]}>
                        <Text style={styles.icon}>{option.icon}</Text>
                        <Text
                            style={[
                                styles.text,
                                active ? styles.activeText : styles.inactiveText,
                            ]}>
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

export const ProductSort = memo(
    ProductSortComponent,
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        alignItems: 'center',
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 16,
    },

    inactiveChip: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    activeChip: {
        backgroundColor: '#1f6f43',
        borderWidth: 1,
        borderColor: '#1f6f43',
    },

    inStockActiveChip: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#2e7d32',
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 6,
    },

    inactiveDot: {
        backgroundColor: '#9ca3af',
    },

    activeDot: {
        backgroundColor: '#2e7d32',
    },

    icon: {
        fontSize: 12,
        marginRight: 5,
    },

    text: {
        fontSize: 12,
        fontWeight: '600',
    },

    inactiveText: {
        color: '#4b5563',
    },

    activeText: {
        color: '#ffffff',
    },

    inStockActiveText: {
        color: '#1b5e20',
    },
});