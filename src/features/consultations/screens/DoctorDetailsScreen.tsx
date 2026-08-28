import React, { useCallback, useMemo, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { RouteProp, useRoute } from '@react-navigation/native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

import {
    addDays,
    formatDateLabel,
    formatDateParam,
    startOfDay,
} from '@/core/utils/date';

import { useDoctorSlots } from '../hooks/useDoctorSlots';
import { SlotCard } from '../components/SlotCard';

import type { DoctorSlot } from '../types/consultation.types';
import type { RootStackParamList } from '@/app/navigation/RootNavigator';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isSlotBookable } from '../utils/slotUtils';

import { useAppTheme } from '@/app/providers/ThemeProvider';

type DetailsRouteProp = RouteProp<
    RootStackParamList,
    'DoctorDetails'
>;

export function DoctorDetailsScreen() {
    const { theme } = useAppTheme();
    const route = useRoute<DetailsRouteProp>();

    const navigation =
        useNavigation<
            NativeStackNavigationProp<RootStackParamList>
        >();

    const { doctor } = route.params;

    const dates = useMemo(
        () =>
            Array.from({ length: 7 }, (_, index) =>
                addDays(startOfDay(new Date()), index),
            ),
        [],
    );

    const [selectedDate, setSelectedDate] = useState(
        dates[0],
    );

    const dateParam = formatDateParam(selectedDate);


    const {
        data: slots,
        isLoading,
        isError,
        error,
        refetch,
    } = useDoctorSlots({
        doctorId: doctor.id,
        date: dateParam,
    });

    const handleSlotPress = useCallback(
        (slot: DoctorSlot) => {
            if (!isSlotBookable(slot)) {
                return;
            }

            navigation.navigate('BookingConfirmation', {
                doctor,
                slot,
            });
        },
        [doctor, navigation],
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
                        'error' in error &&
                        typeof error.error === 'string'
                        ? error.error
                        : 'Unable to load slots.'
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlashList
                data={slots ?? []}
                numColumns={2}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <SlotCard
                        slot={item}
                        onPress={handleSlotPress}
                    />
                )}
                ListHeaderComponent={
                    <View>
                        <View style={[styles.profile, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <Image
                                source={{ uri: doctor.avatarUrl }}
                                style={[styles.avatar, { backgroundColor: theme.colors.border }]}
                            />

                            <Text style={[styles.name, { color: theme.colors.text }]}>
                                {doctor.name}
                            </Text>

                            <Text style={[styles.specialization, { color: theme.colors.primary }]}>
                                {doctor.specialization}
                            </Text>

                            <Text style={[styles.info, { color: theme.colors.textSecondary }]}>
                                {doctor.experienceYears} years experience
                            </Text>

                            <Text style={[styles.info, { color: theme.colors.textSecondary }]}>
                                ⭐ {doctor.rating} ({doctor.reviewCount}{' '}
                                reviews)
                            </Text>

                            <Text style={[styles.feeText, { color: theme.colors.text }]}>
                                ₹{doctor.consultationFee} consultation fee
                            </Text>

                            <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
                                {doctor.bio}
                            </Text>
                        </View>

                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Select Date
                        </Text>

                        <FlashList
                            horizontal
                            data={dates}
                            keyExtractor={item =>
                                item.toISOString()
                            }
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => {
                                const selected =
                                    item.toISOString() ===
                                    selectedDate.toISOString();


                                return (
                                    <Text
                                        onPress={() =>
                                            setSelectedDate(item)
                                        }
                                        style={[
                                            styles.date,
                                            {
                                                backgroundColor: selected
                                                    ? theme.colors.primary
                                                    : theme.colors.surface,
                                                color: selected
                                                    ? '#FFFFFF'
                                                    : theme.colors.text,
                                                borderColor: selected
                                                    ? theme.colors.primary
                                                    : theme.colors.border,
                                            },
                                        ]}>
                                        {formatDateLabel(item)}
                                    </Text>
                                );
                            }}
                        />

                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Available Slots
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <EmptyState
                        title="No slots available"
                        message="No consultation slots are available for this date."
                    />
                }
                contentContainerStyle={styles.content}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        paddingBottom: 24,
    },

    profile: {
        padding: 20,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 16,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    name: {
        marginTop: 12,
        fontSize: 22,
        fontWeight: '700',
    },

    specialization: {
        marginTop: 4,
        fontSize: 15,
        fontWeight: '600',
    },

    info: {
        marginTop: 5,
        fontSize: 13,
    },

    feeText: {
        marginTop: 6,
        fontSize: 15,
        fontWeight: '700',
    },

    bio: {
        marginTop: 12,
        textAlign: 'center',
        lineHeight: 20,
        fontSize: 13,
    },

    sectionTitle: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: '700',
    },

    date: {
        marginLeft: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        borderWidth: 1,
        overflow: 'hidden',
        fontSize: 13,
        fontWeight: '600',
    },
});