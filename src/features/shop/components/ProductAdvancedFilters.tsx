import React, { memo, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/app/providers/ThemeProvider';

const PRICE_PRESETS: readonly {
    label: string;
    min?: number;
    max?: number;
}[] = [
        { label: 'All Prices', min: undefined, max: undefined },
        { label: 'Under ₹500', min: undefined, max: 500 },
        { label: '₹500 - ₹1,000', min: 500, max: 1000 },
        { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
        { label: 'Above ₹2,000', min: 2000, max: undefined },
    ];

const RATING_PRESETS: readonly {
    label: string;
    rating?: number;
}[] = [
        { label: 'All Ratings', rating: undefined },
        { label: '⭐ 4.5 & up', rating: 4.5 },
        { label: '⭐ 4.0 & up', rating: 4.0 },
        { label: '⭐ 3.0 & up', rating: 3.0 },
    ];

type Props = {
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    onApply: (filters: {
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
    }) => void;
};

function ProductAdvancedFiltersComponent({
    minPrice,
    maxPrice,
    minRating,
    onApply,
}: Props) {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const bottomInset = Math.max(insets.bottom, 16);

    const [visible, setVisible] = useState(false);
    const [draftMinPrice, setDraftMinPrice] = useState(minPrice);
    const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice);
    const [draftMinRating, setDraftMinRating] = useState(minRating);


    const activeFilterCount =
        (minPrice !== undefined || maxPrice !== undefined ? 1 : 0) +
        (minRating !== undefined ? 1 : 0);

    const openModal = () => {
        setDraftMinPrice(minPrice);
        setDraftMaxPrice(maxPrice);
        setDraftMinRating(minRating);
        setVisible(true);
    };

    const handleReset = () => {
        setDraftMinPrice(undefined);
        setDraftMaxPrice(undefined);
        setDraftMinRating(undefined);
    };

    const apply = () => {
        onApply({
            minPrice: draftMinPrice,
            maxPrice: draftMaxPrice,
            minRating: draftMinRating,
        });
        setVisible(false);
    };

    return (
        <>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open advanced filters"
                onPress={openModal}
                style={[
                    styles.triggerButton,
                    {
                        backgroundColor: activeFilterCount > 0 ? (theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9') : theme.colors.surface,
                        borderColor: activeFilterCount > 0 ? theme.colors.primary : theme.colors.border,
                    },
                ]}>
                <Text style={styles.triggerIcon}>🎛️</Text>
                <Text
                    style={[
                        styles.triggerText,
                        {
                            color: activeFilterCount > 0 ? theme.colors.primary : theme.colors.text,
                        },
                    ]}>
                    Filters
                </Text>
                {activeFilterCount > 0 ? (
                    <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.badgeText}>{activeFilterCount}</Text>
                    </View>
                ) : null}
            </Pressable>

            <Modal
                visible={visible}
                animationType="fade"
                transparent
                onRequestClose={() => setVisible(false)}>
                <View style={styles.overlay}>
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setVisible(false)}
                    />

                    <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
                        {/* Header */}
                        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                            <Text style={[styles.title, { color: theme.colors.text }]}>Filter Products</Text>
                            <View style={styles.headerActions}>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={handleReset}
                                    style={styles.resetButton}>
                                    <Text style={[styles.resetText, { color: theme.colors.danger }]}>Reset All</Text>
                                </Pressable>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => setVisible(false)}
                                    style={[styles.closeButton, { backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f3f4f6' }]}>
                                    <Text style={[styles.closeIcon, { color: theme.colors.textSecondary }]}>✕</Text>
                                </Pressable>
                            </View>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.body}>
                            {/* Price Range Section */}
                            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>💰 Price Range</Text>
                            <View style={styles.pillGrid}>
                                {PRICE_PRESETS.map(preset => {
                                    const isSelected =
                                        draftMinPrice === preset.min &&
                                        draftMaxPrice === preset.max;

                                    return (
                                        <Pressable
                                            key={preset.label}
                                            accessibilityRole="button"
                                            onPress={() => {
                                                setDraftMinPrice(preset.min);
                                                setDraftMaxPrice(preset.max);
                                            }}
                                            style={[
                                                styles.pill,
                                                {
                                                    backgroundColor: isSelected
                                                        ? theme.colors.primary
                                                        : (theme.mode === 'dark' ? '#2a2a2a' : '#f9fafb'),
                                                    borderColor: isSelected
                                                        ? theme.colors.primary
                                                        : theme.colors.border,
                                                },
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.pillText,
                                                    {
                                                        color: isSelected
                                                            ? '#FFFFFF'
                                                            : theme.colors.text,
                                                        fontWeight: isSelected ? '700' : '500',
                                                    },
                                                ]}>
                                                {preset.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* Rating Section */}
                            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>⭐ Customer Rating</Text>
                            <View style={styles.pillGrid}>
                                {RATING_PRESETS.map(preset => {
                                    const isSelected = draftMinRating === preset.rating;

                                    return (
                                        <Pressable
                                            key={preset.label}
                                            accessibilityRole="button"
                                            onPress={() => setDraftMinRating(preset.rating)}
                                            style={[
                                                styles.pill,
                                                {
                                                    backgroundColor: isSelected
                                                        ? theme.colors.primary
                                                        : (theme.mode === 'dark' ? '#2a2a2a' : '#f9fafb'),
                                                    borderColor: isSelected
                                                        ? theme.colors.primary
                                                        : theme.colors.border,
                                                },
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.pillText,
                                                    {
                                                        color: isSelected
                                                            ? '#FFFFFF'
                                                            : theme.colors.text,
                                                        fontWeight: isSelected ? '700' : '500',
                                                    },
                                                ]}>
                                                {preset.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        {/* Apply Button */}
                        <View style={[styles.footer, { paddingBottom: bottomInset + 12 }]}>
                            <Pressable
                                onPress={apply}
                                style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
                                accessibilityRole="button">
                                <Text style={styles.applyText}>Apply Filters</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export const ProductAdvancedFilters = memo(
    ProductAdvancedFiltersComponent,
);

const styles = StyleSheet.create({
    triggerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        height: 48,
        minWidth: 48,
    },

    triggerIcon: {
        fontSize: 16,
    },

    triggerText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '600',
    },

    badge: {
        marginLeft: 6,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },

    badgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '700',
    },

    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    backdrop: {
        flex: 1,
    },

    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '82%',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
    },

    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    resetButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 8,
    },

    resetText: {
        fontSize: 13,
        fontWeight: '600',
    },

    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    closeIcon: {
        fontSize: 14,
        fontWeight: '700',
    },

    body: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 12,
    },

    pillGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 10,
    },

    pill: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 12,
        borderWidth: 1,
    },

    pillText: {
        fontSize: 13,
    },

    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },

    applyButton: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        elevation: 4,
    },

    applyText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});
