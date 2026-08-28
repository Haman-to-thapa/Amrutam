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
import { OfflineDataNotice } from '@/components/feedback/OfflineDataNotice';
import { useDoctors } from '../hooks/useDoctors';
import type {
    Doctor,
    DoctorSpecialization,
} from '../types/consultation.types';
import type { RootStackParamList } from '@/app/navigation/RootNavigator';

import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/app/providers/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAGE_SIZE = 30;

export function DoctorListScreen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { theme } = useAppTheme();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList, 'Doctors'>>();

    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] =
        useState<DoctorSpecialization | undefined>();

    const debouncedSearch = useDebounce(search, 300);

    const { data, isLoading, isFetching, isError, error, refetch } =
        useDoctors({
            page: 1,
            pageSize: PAGE_SIZE,
            search: debouncedSearch.trim() || undefined,
            filters: {
                specialization,
            },
        });

    const doctors = data?.data ?? [];

    const renderItem = useCallback(
        ({ item }: { item: Doctor }) => (
            <DoctorCard
                doctor={item}
                onPress={() =>
                    navigation.navigate('DoctorDetails', {
                        doctorId: item.id,
                        doctor: item,
                    })
                }
            />
        ),
        [navigation],
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <OfflineDataNotice message="Showing cached doctors list. Connect to internet for live updates." />
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {t('consultation.title')}
                </Text>

                <Input
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t('consultation.searchDoctors')}
                    accessibilityLabel="Search doctors"
                    style={{ marginBottom: 12 }}
                />

                <DoctorFilters
                    selected={specialization}
                    onChange={setSpecialization}
                />

                {isFetching && !isLoading ? (
                    <Text style={[styles.refreshing, { color: theme.colors.textSecondary }]}>{t('common.updating')}</Text>
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
                    title={t('consultation.noDoctors')}
                    message={t('consultation.noDoctorsDesc')}
                />
            ) : (
                <FlashList
                    data={doctors}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
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
