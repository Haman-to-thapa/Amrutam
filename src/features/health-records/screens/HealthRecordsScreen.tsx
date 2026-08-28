import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    SectionList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/core/utils/useDebounce';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { OfflineDataNotice } from '@/components/feedback/OfflineDataNotice';

import type { HealthRecordsStackParamList } from '@/app/navigation/HealthRecordsNavigator';
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
import { useAppTheme } from '@/app/providers/ThemeProvider';

const PAGE_SIZE = 50;

export function HealthRecordsScreen() {
    const { theme } = useAppTheme();
    const navigation =
        useNavigation<NativeStackNavigationProp<HealthRecordsStackParamList, 'HealthRecords'>>();

    const [page, setPage] = useState(1);
    const [loadedRecords, setLoadedRecords] = useState<HealthRecord[]>([]);

    const [search, setSearch] = useState('');
    const [recordType, setRecordType] =
        useState<HealthRecordType | undefined>();
    const [selectedTag, setSelectedTag] =
        useState<string | undefined>();

    const debouncedSearch = useDebounce(search, 350);

    // Reset pagination when search or filters change
    useEffect(() => {
        setPage(1);
        setLoadedRecords([]);
    }, [debouncedSearch, recordType, selectedTag]);

    const params = useMemo(
        () => ({
            page,
            pageSize: PAGE_SIZE,
            search: debouncedSearch.trim() || undefined,
            filters: {
                types: recordType ? [recordType] : undefined,
                tags: selectedTag ? [selectedTag] : undefined,
            },
        }),
        [debouncedSearch, page, recordType, selectedTag],
    );

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useHealthRecords(params);

    // Accumulate paginated records
    useEffect(() => {
        if (!data) {
            return;
        }

        setLoadedRecords(currentRecords => {
            if (page === 1) {
                return data.data;
            }

            const existingIds = new Set(
                currentRecords.map(record => record.id),
            );

            const newRecords = data.data.filter(
                record => !existingIds.has(record.id),
            );

            return [...currentRecords, ...newRecords];
        });
    }, [data, page]);

    const sections = useMemo(
        () => groupRecordsByMonthYear(loadedRecords),
        [loadedRecords],
    );

    const hasFilters = Boolean(
        search.trim() || recordType || selectedTag,
    );

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

    const handleEndReached = useCallback(() => {
        if (isFetching || !data?.hasNextPage) {
            return;
        }

        setPage(currentPage => currentPage + 1);
    }, [data?.hasNextPage, isFetching]);

    const handleRefresh = useCallback(() => {
        setPage(1);
        setLoadedRecords([]);
        refetch();
    }, [refetch]);

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
            <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
                <View style={styles.sectionTitleRow}>
                    <Text style={styles.calendarIcon}>🗓️</Text>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        {section.title}
                    </Text>
                </View>
                <Text style={[styles.sectionBadge, { color: theme.colors.textSecondary }]}>
                    {section.data.length} {section.data.length === 1 ? 'Record' : 'Records'}
                </Text>
            </View>
        ),
        [theme],
    );

    const isInitialLoading = isLoading && page === 1;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <OfflineDataNotice message="Showing cached medical timeline. Connect to internet for live record synchronization." />
            {/* Top Search & Filter Container (Sticky & Outside SectionList to prevent focus loss) */}
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <View style={styles.titleRow}>
                    <View>
                        <Text style={[styles.title, { color: theme.colors.text }]}>Medical Timeline</Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            {loadedRecords.length > 0
                                ? `${loadedRecords.length}${data?.total ? ` of ${data.total}` : ''} Verified Records`
                                : '10,000+ Verified Patient Health Records'}
                        </Text>
                    </View>
                    {hasFilters ? (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Clear health record filters"
                            onPress={clearFilters}
                            style={[styles.clearButton, { backgroundColor: theme.mode === 'dark' ? '#3b1818' : '#fee2e2' }]}>
                            <Text style={[styles.clearButtonText, { color: theme.colors.danger }]}>Reset ✕</Text>
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
            {isInitialLoading ? (
                <LoadingState />
            ) : isError && loadedRecords.length === 0 ? (
                <ErrorState
                    message={
                        error &&
                            typeof error === 'object' &&
                            'message' in error &&
                            typeof error.message === 'string'
                            ? error.message
                            : 'Unable to load health records.'
                    }
                    onRetry={handleRefresh}
                />
            ) : !isFetching && loadedRecords.length === 0 ? (
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
                            style={[styles.resetFiltersButton, { backgroundColor: theme.colors.primary }]}>
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
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={12}
                    maxToRenderPerBatch={12}
                    windowSize={7}
                    removeClippedSubviews
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={isFetching && page === 1}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                    ListFooterComponent={
                        isFetching && page > 1 ? (
                            <View style={styles.footer}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                                <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>Loading more records...</Text>
                            </View>
                        ) : undefined
                    }

                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        borderBottomWidth: 1,
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
    },

    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },

    clearButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },

    clearButtonText: {
        fontSize: 12,
        fontWeight: '700',
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
        borderBottomWidth: 1,
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
    },

    sectionBadge: {
        fontSize: 12,
        fontWeight: '600',
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    resetFiltersButton: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },

    resetFiltersButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },

    footer: {
        alignItems: 'center',
        paddingVertical: 20,
        gap: 6,
    },

    footerText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
