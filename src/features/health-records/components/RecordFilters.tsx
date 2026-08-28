import React, { memo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { HealthRecordType } from '../types/health-record.types';

const RECORD_TYPES: readonly {
    value: HealthRecordType | undefined;
    label: string;
    icon: string;
}[] = [
    { value: undefined, label: 'All Records', icon: '📋' },
    { value: 'lab_report', label: 'Lab Report', icon: '🧪' },
    { value: 'prescription', label: 'Prescription', icon: '💊' },
    { value: 'consultation', label: 'Consultation', icon: '👨‍⚕️' },
    { value: 'vaccination', label: 'Vaccination', icon: '💉' },
    { value: 'allergy', label: 'Allergy', icon: '⚠️' },
];

type Props = {
    selectedType?: HealthRecordType;
    onTypeChange: (
        value: HealthRecordType | undefined,
    ) => void;
};

function RecordFiltersComponent({
    selectedType,
    onTypeChange,
}: Props) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                {RECORD_TYPES.map(option => {
                    const active =
                        selectedType === option.value;

                    return (
                        <Pressable
                            key={option.label}
                            accessibilityRole="button"
                            accessibilityLabel={`Filter ${option.label}`}
                            onPress={() =>
                                onTypeChange(option.value)
                            }
                            style={[
                                styles.chip,
                                active && styles.activeChip,
                            ]}>
                            <Text style={styles.icon}>{option.icon}</Text>
                            <Text
                                style={[
                                    styles.text,
                                    active && styles.activeText,
                                ]}>
                                {option.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export const RecordFilters = memo(
    RecordFiltersComponent,
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },

    content: {
        paddingHorizontal: 16,
        gap: 8,
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },

    activeChip: {
        backgroundColor: '#1f6f43',
        borderColor: '#1f6f43',
    },

    icon: {
        fontSize: 13,
        marginRight: 6,
    },

    text: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4b5563',
    },

    activeText: {
        color: '#ffffff',
        fontWeight: '700',
    },
});
