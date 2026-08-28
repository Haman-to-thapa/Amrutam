import React, { useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';

import type { HealthRecordsStackParamList } from '@/app/navigation/HealthRecordsNavigator';
import { useHealthRecordDetails } from '../hooks/useHealthRecordDetails';
import { AttachmentPreview } from '../components/AttachmentPreview';

const TYPE_CONFIG = {
    lab_report: { label: 'Lab Report', icon: '🧪', bg: '#eff6ff', color: '#1d4ed8' },
    prescription: { label: 'Prescription', icon: '💊', bg: '#f0fdf4', color: '#15803d' },
    consultation: { label: 'Consultation', icon: '👨‍⚕️', bg: '#faf5ff', color: '#7e22ce' },
    vaccination: { label: 'Vaccination', icon: '💉', bg: '#ecfeff', color: '#0e7490' },
    allergy: { label: 'Allergy Alert', icon: '⚠️', bg: '#fef2f2', color: '#b91c1c' },
} as const;

type DetailsRouteProp = RouteProp<
    HealthRecordsStackParamList,
    'HealthRecordDetails'
>;

export function HealthRecordDetailsScreen() {
    const insets = useSafeAreaInsets();
    const route = useRoute<DetailsRouteProp>();
    const { recordId } = route.params;

    const {
        data: record,
        isLoading,
        isError,
        error,
        refetch,
    } = useHealthRecordDetails(recordId);

    const formattedDate = useMemo(() => {
        if (!record) {
            return '';
        }

        return new Date(record.date).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }, [record]);

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return (
            <ErrorState
                message={
                    error &&
                        typeof error === 'object' &&
                        'message' in error &&
                        typeof error.message === 'string'
                        ? error.message
                        : 'Unable to load health record.'
                }
                onRetry={refetch}
            />
        );
    }

    if (!record) {
        return (
            <EmptyState
                title="Record unavailable"
                message="This health record could not be found."
            />
        );
    }

    const typeConfig = TYPE_CONFIG[record.type] ?? {
        label: record.type,
        icon: '📋',
        bg: '#f3f4f6',
        color: '#374151',
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                styles.content,
                { paddingBottom: insets.bottom + 32 },
            ]}>
            {/* Header Type Badge & Title */}
            <View style={[styles.typeBadge, { backgroundColor: typeConfig.bg }]}>
                <Text style={styles.typeIcon}>{typeConfig.icon}</Text>
                <Text style={[styles.typeText, { color: typeConfig.color }]}>
                    {typeConfig.label}
                </Text>
            </View>

            <Text style={styles.title}>{record.title}</Text>

            <Text style={styles.date}>🗓️ {formattedDate}</Text>

            {/* Description Card */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Summary & Notes</Text>
                <Text style={styles.description}>{record.description}</Text>
            </View>

            {/* Doctor / Facility Info Card */}
            {record.doctorName || record.facilityName ? (
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Medical Provider</Text>
                    {record.doctorName ? (
                        <InfoRow label="Consulting Doctor" value={record.doctorName} />
                    ) : null}
                    {record.facilityName ? (
                        <InfoRow label="Healthcare Facility" value={record.facilityName} />
                    ) : null}
                </View>
            ) : null}

            {/* Metadata Attributes */}
            {Object.keys(record.metadata).length > 0 ? (
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Clinical Details</Text>
                    {Object.entries(record.metadata).map(([key, value]) => (
                        <InfoRow
                            key={key}
                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            value={String(value)}
                        />
                    ))}
                </View>
            ) : null}

            {/* Tags */}
            {record.tags.length > 0 ? (
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Tags & Categories</Text>
                    <View style={styles.tagsContainer}>
                        {record.tags.map(tag => (
                            <View key={tag} style={styles.tagPill}>
                                <Text style={styles.tagText}>#{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ) : null}

            {/* Attachments Section */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                    Attachments ({record.attachments.length})
                </Text>

                {record.attachments.length > 0 ? (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.attachmentsContainer}>
                        {record.attachments.map(attachment => (
                            <AttachmentPreview
                                key={attachment.id}
                                attachment={attachment}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.noAttachment}>
                        No digital attachments linked with this record.
                    </Text>
                )}
            </View>
        </ScrollView>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        backgroundColor: '#f8f9fa',
    },

    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
    },

    typeIcon: {
        fontSize: 14,
    },

    typeText: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    title: {
        marginTop: 12,
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        lineHeight: 28,
    },

    date: {
        marginTop: 6,
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '500',
    },

    sectionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 16,
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 10,
    },

    description: {
        fontSize: 14,
        lineHeight: 22,
        color: '#374151',
    },

    infoRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },

    infoLabel: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },

    infoValue: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },

    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    tagPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
    },

    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },

    attachmentsContainer: {
        paddingTop: 4,
    },

    noAttachment: {
        fontSize: 13,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
});
