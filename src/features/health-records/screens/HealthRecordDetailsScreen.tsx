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
import { useTranslation } from 'react-i18next';

import type { HealthRecordsStackParamList } from '@/app/navigation/HealthRecordsNavigator';
import { useHealthRecordDetails } from '../hooks/useHealthRecordDetails';
import { AttachmentPreview } from '../components/AttachmentPreview';
import { useAppTheme } from '@/app/providers/ThemeProvider';
import { useLanguage } from '@/app/providers/LanguageProvider';

const TYPE_CONFIG = {
    lab_report: { icon: '🧪', bg: '#eff6ff', color: '#1d4ed8' },
    prescription: { icon: '💊', bg: '#f0fdf4', color: '#15803d' },
    consultation: { icon: '👨‍⚕️', bg: '#faf5ff', color: '#7e22ce' },
    vaccination: { icon: '💉', bg: '#ecfeff', color: '#0e7490' },
    allergy: { icon: '⚠️', bg: '#fef2f2', color: '#b91c1c' },
} as const;

type DetailsRouteProp = RouteProp<
    HealthRecordsStackParamList,
    'HealthRecordDetails'
>;

export function HealthRecordDetailsScreen() {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const { theme } = useAppTheme();
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

        return new Date(record.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }, [record, language]);

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
                title={t('common.empty')}
                message="This health record could not be found."
            />
        );
    }

    const typeConfig = TYPE_CONFIG[record.type] ?? {
        icon: '📋',
        bg: '#f3f4f6',
        color: '#374151',
    };

    const typeLabel = t(`recordTypes.${record.type}` as const, {
        defaultValue: record.type,
    });

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                styles.content,
                { backgroundColor: theme.colors.background, paddingBottom: insets.bottom + 120 },
            ]}>
            {/* Header Type Badge & Title */}
            <View style={[styles.typeBadge, { backgroundColor: typeConfig.bg }]}>
                <Text style={styles.typeIcon}>{typeConfig.icon}</Text>
                <Text style={[styles.typeText, { color: typeConfig.color }]}>
                    {typeLabel}
                </Text>
            </View>

            <Text style={[styles.title, { color: theme.colors.text }]}>{record.title}</Text>

            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>🗓️ {formattedDate}</Text>

            {/* Description Card */}
            <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Summary & Notes</Text>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{record.description}</Text>
            </View>

            {/* Doctor / Facility Info Card */}
            {record.doctorName || record.facilityName ? (
                <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Medical Provider</Text>
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
                <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Clinical Details</Text>
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
                <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tags & Categories</Text>
                    <View style={styles.tagsContainer}>
                        {record.tags.map(tag => (
                            <View
                                key={tag}
                                style={[
                                    styles.tagPill,
                                    {
                                        backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f3f4f6',
                                    },
                                ]}>
                                <Text style={[styles.tagText, { color: theme.colors.text }]}>#{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ) : null}

            {/* Attachments Section */}
            <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
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
                    <Text style={[styles.noAttachment, { color: theme.colors.textSecondary }]}>
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
    const { theme } = useAppTheme();

    return (
        <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
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
        lineHeight: 28,
    },

    date: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: '500',
    },

    sectionCard: {
        borderRadius: 14,
        padding: 16,
        marginTop: 14,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 10,
    },

    description: {
        fontSize: 14,
        lineHeight: 22,
    },

    infoRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
    },

    infoLabel: {
        fontSize: 12,
        fontWeight: '500',
    },

    infoValue: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: '600',
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
    },

    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },

    attachmentsContainer: {
        paddingTop: 4,
    },

    noAttachment: {
        fontSize: 13,
        fontStyle: 'italic',
    },
});

