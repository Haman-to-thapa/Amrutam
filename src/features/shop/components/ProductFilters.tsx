import React, { memo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ProductCategory } from '../types/shop.types';

const CATEGORIES: readonly { name: ProductCategory; icon: string }[] = [
    { name: 'Supplements', icon: '💊' },
    { name: 'Herbal Oils', icon: '🧴' },
    { name: 'Digestive Care', icon: '🍵' },
    { name: 'Skin Care', icon: '✨' },
    { name: 'Hair Care', icon: '💆' },
    { name: 'Wellness', icon: '🧘' },
];

type Props = {
    selectedCategory?: ProductCategory;
    onCategoryChange: (
        category: ProductCategory | undefined,
    ) => void;
};

function ProductFiltersComponent({
    selectedCategory,
    onCategoryChange,
}: Props) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="All categories"
                    onPress={() => onCategoryChange(undefined)}
                    style={[
                        styles.chip,
                        selectedCategory === undefined
                            ? styles.activeChip
                            : styles.inactiveChip,
                    ]}>
                    <Text style={styles.icon}>🌿</Text>
                    <Text
                        style={[
                            styles.text,
                            selectedCategory === undefined
                                ? styles.activeText
                                : styles.inactiveText,
                        ]}>
                        All
                    </Text>
                </Pressable>

                {CATEGORIES.map(cat => {
                    const active = selectedCategory === cat.name;

                    return (
                        <Pressable
                            key={cat.name}
                            accessibilityRole="button"
                            accessibilityLabel={`Filter ${cat.name}`}
                            onPress={() => onCategoryChange(cat.name)}
                            style={[
                                styles.chip,
                                active
                                    ? styles.activeChip
                                    : styles.inactiveChip,
                            ]}>
                            <Text style={styles.icon}>{cat.icon}</Text>
                            <Text
                                style={[
                                    styles.text,
                                    active
                                        ? styles.activeText
                                        : styles.inactiveText,
                                ]}>
                                {cat.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export const ProductFilters = memo(
    ProductFiltersComponent,
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 6,
    },

    content: {
        paddingHorizontal: 16,
        paddingVertical: 2,
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
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
        shadowColor: '#1f6f43',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },

    icon: {
        fontSize: 14,
        marginRight: 6,
    },

    text: {
        fontSize: 13,
        fontWeight: '600',
    },

    inactiveText: {
        color: '#374151',
    },

    activeText: {
        color: '#ffffff',
    },
});