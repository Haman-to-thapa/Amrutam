import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/core/utils/useDebounce';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DoctorCard } from '../components/DoctorCard';
import { DoctorFilters } from '../components/DoctorFilters';
import { useDoctors } from '../hooks/useDoctors';
import type {
    Doctor,
    DoctorSpecialization,
} from '../types/consultation.types';
import type { RootStackParamList } from '@/app/navigation/RootNavigator';

import { useAppTheme } from '@/app/providers/ThemeProvider';

const PAGE_SIZE = 30;

export function DoctorListScreen() {
    const { theme } = useAppTheme();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList, 'Doctors'>>();

    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] =
        useState<DoctorSpecialization | undefined>();

    const debouncedSearch = useDebounce(search, 350);

    const { data, isLoading, isFetching, isError, error, refetch } =
        useDoctors({
            page: 1,
            pageSize: PAGE_SIZE,
            search: debouncedSearch.trim() || undefined,
            filters: {
                specialization,
            },
        });

    const renderItem = useCallback(
        ({ item }: { item: Doctor }) => (
            <DoctorCard
                doctor={item}
                onPress={() =>
                    navigation.navigate('DoctorDetails', {
                        doctor: item,
                    })
                }
            />
        ),
        [navigation],
    );

    const doctors = data?.data ?? [];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Ayurvedic Doctors</Text>

                <Input
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search doctors..."
                    accessibilityLabel="Search doctors"
                />

                <DoctorFilters
                    selected={specialization}
                    onChange={setSpecialization}
                />

                {isFetching && !isLoading ? (
                    <Text style={[styles.refreshing, { color: theme.colors.textSecondary }]}>Updating...</Text>
                ) : null}
            </View>

            {isLoading ? (
                <LoadingState />
            ) : isError ? (
                <ErrorState
                    message={
                        error &&
                            typeof error === 'object' &&
                            'error' in error &&
                            typeof error.error === 'string'
                            ? error.error
                            : 'Unable to load doctors.'
                    }
                    onRetry={refetch}
                />
            ) : doctors.length === 0 ? (
                <EmptyState
                    title="No doctors found"
                    message="There are no doctors matching your search."
                />
            ) : (
                <FlashList
                    data={doctors}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
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
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
    },

    refreshing: {
        marginTop: 4,
        fontSize: 12,
    },

    list: {
        paddingBottom: 24,
    },
});
