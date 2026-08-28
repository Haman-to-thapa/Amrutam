import React, { memo } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { HealthRecord } from '../types/health-record.types';

type Props = {
    record: HealthRecord;
    onPress?: (record: HealthRecord) => void;
};

const TYPE_CONFIG: Record<
    HealthRecord['type'],
    { label: string; icon: string; bg: string; color: string }
> = {
    lab_report: {
        label: 'Lab Report',
        icon: '🧪',
        bg: '#eff6ff',
        color: '#1d4ed8',
    },
    prescription: {
        label: 'Prescription',
        icon: '💊',
        bg: '#f0fdf4',
        color: '#15803d',
    },
    consultation: {
        label: 'Consultation',
        icon: '👨‍⚕️',
        bg: '#faf5ff',
        color: '#7e22ce',
    },
    vaccination: {
        label: 'Vaccination',
        icon: '💉',
        bg: '#ecfeff',
        color: '#0e7490',
    },
    allergy: {
        label: 'Allergy Alert',
        icon: '⚠️',
        bg: '#fef2f2',
        color: '#b91c1c',
    },
};

function RecordCardComponent({ record, onPress }: Props) {
    const date = new Date(record.date);
    const config = TYPE_CONFIG[record.type] ?? {
        label: record.type,
        icon: '📋',
        bg: '#f3f4f6',
        color: '#374151',
    };

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${record.title}`}
            onPress={() => onPress?.(record)}
            style={styles.card}>

            {/* Top Type Pill & Date */}
            <View style={styles.header}>
                <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
                    <Text style={styles.typeIcon}>{config.icon}</Text>
                    <Text style={[styles.typeText, { color: config.color }]}>
                        {config.label}
                    </Text>
                </View>

                <Text style={styles.date}>
                    {date.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </Text>
            </View>

            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
                {record.title}
            </Text>

            {/* Description */}
            <Text style={styles.description} numberOfLines={3}>
                {record.description}
            </Text>

            {/* Metadata (Doctor / Facility) */}
            <View style={styles.metaRow}>
                {record.doctorName ? (
                    <Text style={styles.metaText}>
                        👨‍⚕️ {record.doctorName}
                    </Text>
                ) : null}

                {record.facilityName ? (
                    <Text style={styles.metaText}>
                        🏥 {record.facilityName}
                    </Text>
                ) : null}
            </View>

            {/* Tags */}
            {record.tags.length > 0 ? (
                <View style={styles.tagsContainer}>
                    {record.tags.map(tag => (
                        <View
                            key={`${record.id}-${tag}`}
                            style={styles.tagPill}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </View>
            ) : null}
        </Pressable>
    );
}


export const RecordCard = memo(
    RecordCardComponent,
);

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 5,
    },

    typeIcon: {
        fontSize: 12,
    },

    typeText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    date: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },

    title: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 22,
    },

    description: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 19,
        color: '#4b5563',
    },

    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 8,
    },

    metaText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },

    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 6,
    },

    tagPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
    },

    tagText: {
        fontSize: 11,
        color: '#374151',
        fontWeight: '600',
    },
});
