import React, { useCallback, useMemo, useState } from 'react';
import {
    Pressable,
    RefreshControl,
    SectionList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/core/utils/useDebounce';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

import { useHealthRecords } from '../hooks/useHealthRecords';
import {
    groupRecordsByMonthYear,
    type HealthRecordSection,
} from '../utils/groupRecords';
import { RecordCard } from '../components/RecordCard';
import { RecordFilters } from '../components/RecordFilters';
import { RecordTagFilter } from '../components/RecordTagFilter';
import type {
    HealthRecord,
    HealthRecordType,
} from '../types/health-record.types';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HealthRecordsStackParamList } from '@/app/navigation/HealthRecordsNavigator';

const PAGE_SIZE = 50;

export function HealthRecordsScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<HealthRecordsStackParamList, 'HealthRecords'>>();

    const [search, setSearch] = useState('');
    const [recordType, setRecordType] =
        useState<HealthRecordType | undefined>();
    const [selectedTag, setSelectedTag] =
        useState<string | undefined>();

    const debouncedSearch = useDebounce(search, 350);

    const params = useMemo(
        () => ({
            page: 1,
            pageSize: PAGE_SIZE,
            search: debouncedSearch.trim() || undefined,
            filters: {
                types: recordType ? [recordType] : undefined,
                tags: selectedTag ? [selectedTag] : undefined,
            },
        }),
        [debouncedSearch, recordType, selectedTag],
    );

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useHealthRecords(params);

    const records = data?.data;

    const sections = useMemo(
        () => (records ? groupRecordsByMonthYear(records) : []),
        [records],
    );

    const hasFilters =
        search.trim().length > 0 ||
        recordType !== undefined ||
        selectedTag !== undefined;

    const clearFilters = useCallback(() => {
        setSearch('');
        setRecordType(undefined);
        setSelectedTag(undefined);
    }, []);

    const handleRecordPress = useCallback(
        (record: HealthRecord) => {
            navigation.navigate('HealthRecordDetails', {
                recordId: record.id,
            });
        },
        [navigation],
    );

    const renderItem = useCallback(
        ({
            item,
        }: {
            item: HealthRecord;
        }) => (
            <RecordCard
                record={item}
                onPress={handleRecordPress}
            />
        ),
        [handleRecordPress],
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

    return (
        <View style={styles.container}>
            {/* Top Search & Filter Container (Sticky & Outside SectionList to prevent focus loss) */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View>
                        <Text style={styles.title}>Medical Timeline</Text>
                        <Text style={styles.subtitle}>
                            10,000+ Verified Patient Health Records
                        </Text>
                    </View>
                    {hasFilters ? (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Clear health record filters"
                            onPress={clearFilters}
                            style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>Reset ✕</Text>
                        </Pressable>
                    ) : null}
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Input
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search doctor, diagnosis, reports..."
                        accessibilityLabel="Search health records"
                    />
                </View>

                {/* Category Type Filter */}
                <RecordFilters
                    selectedType={recordType}
                    onTypeChange={setRecordType}
                />

                {/* Tag Filter */}
                <RecordTagFilter
                    selectedTag={selectedTag}
                    onChange={setSelectedTag}
                />
            </View>

            {/* Content Area */}
            {isLoading ? (
                <LoadingState />
            ) : isError ? (
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
            ) : !records || records.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <EmptyState
                        title="No Records Found"
                        message={
                            hasFilters
                                ? 'No health records match your selected filters and search query.'
                                : 'Your health records will appear here.'
                        }
                    />
                    {hasFilters ? (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Clear filters"
                            onPress={clearFilters}
                            style={styles.resetFiltersButton}>
                            <Text style={styles.resetFiltersButtonText}>Clear All Filters</Text>
                        </Pressable>
                    ) : null}
                </View>
            ) : (
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
                            onRefresh={() => {
                                refetch();
                            }}
                            colors={['#1f6f43']}
                            tintColor="#1f6f43"
                        />
                    }

                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    header: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 2,
    },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },

    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },

    subtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },

    clearButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: '#fee2e2',
    },

    clearButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#b91c1c',
    },

    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },

    content: {
        paddingTop: 6,
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
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
    },

    sectionBadge: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    resetFiltersButton: {
        marginTop: 16,
        backgroundColor: '#1f6f43',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },

    resetFiltersButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
});
