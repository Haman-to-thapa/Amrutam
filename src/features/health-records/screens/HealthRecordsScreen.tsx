import React, { useCallback, useMemo } from 'react';
import {
    RefreshControl,
    SectionList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

import { useHealthRecords } from '../hooks/useHealthRecords';
import {
    groupRecordsByMonthYear,
    type HealthRecordSection,
} from '../utils/groupRecords';
import { RecordCard } from '../components/RecordCard';
import type { HealthRecord } from '../types/health-record.types';

const PAGE_SIZE = 50;

export function HealthRecordsScreen() {
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useHealthRecords({
        page: 1,
        pageSize: PAGE_SIZE,
    });

    const records = data?.data ?? [];

    const sections = useMemo(
        () => groupRecordsByMonthYear(records),
        [records],
    );

    const renderItem = useCallback(
        ({
            item,
        }: {
            item: HealthRecord;
        }) => (
            <RecordCard record={item} />
        ),
        [],
    );

    const renderSectionHeader = useCallback(
        ({
            section,
        }: {
            section: HealthRecordSection;
        }) => (
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                    <Text style={styles.calendarIcon}>🗓️</Text>
                    <Text style={styles.sectionTitle}>
                        {section.title}
                    </Text>
                </View>
                <Text style={styles.sectionBadge}>
                    {section.data.length} {section.data.length === 1 ? 'Record' : 'Records'}
                </Text>
            </View>
        ),
        [],
    );

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
                        : 'Unable to load health records.'
                }
                onRetry={refetch}
            />
        );
    }

    if (records.length === 0) {
        return (
            <EmptyState
                title="No Health Records"
                message="Your prescriptions, lab reports and consultation records will appear here in chronological timeline."
            />
        );
    }

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                stickySectionHeadersEnabled
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching && !isLoading}
                        // onRefresh={refetch}
                        colors={['#1f6f43']}
                        tintColor="#1f6f43"
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    content: {
        paddingBottom: 24,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(248, 249, 250, 0.95)',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },

    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    calendarIcon: {
        fontSize: 14,
        marginRight: 6,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1f2937',
    },

    sectionBadge: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
    },
});
