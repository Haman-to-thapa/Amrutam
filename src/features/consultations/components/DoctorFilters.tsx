import React, { memo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    Pressable,
    View,
} from 'react-native';

import type {
    DoctorSpecialization,
} from '../types/consultation.types';

const FILTERS: readonly (
    | 'All'
    | DoctorSpecialization
)[] = [
        'All',
        'Ayurvedic Physician',
        'Panchakarma',
        'Dermatology',
        'Digestive Health',
        'Women Health',
        'Stress Management',
    ];

type Props = {
    selected?: DoctorSpecialization;
    onChange: (
        value: DoctorSpecialization | undefined,
    ) => void;
};

function DoctorFiltersComponent({
    selected,
    onChange,
}: Props) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                {FILTERS.map(filter => {
                    const isAll = filter === 'All';
                    const active = isAll
                        ? selected === undefined
                        : selected === filter;

                    return (
                        <Pressable
                            key={filter}
                            accessibilityRole="button"
                            accessibilityLabel={`Filter by ${filter}`}
                            onPress={() =>
                                onChange(
                                    isAll
                                        ? undefined
                                        : (filter as DoctorSpecialization),
                                )
                            }
                            style={[
                                styles.chip,
                                active && styles.activeChip,
                            ]}>
                            <Text
                                style={[
                                    styles.text,
                                    active && styles.activeText,
                                ]}>
                                {filter}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export const DoctorFilters = memo(
    DoctorFiltersComponent,
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },

    content: {
        paddingHorizontal: 16,
    },

    chip: {
        marginRight: 8,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        backgroundColor: '#fff',
    },

    activeChip: {
        backgroundColor: '#1f6f43',
        borderColor: '#1f6f43',
    },

    text: {
        fontSize: 13,
    },

    activeText: {
        color: '#fff',
        fontWeight: '600',
    },
});