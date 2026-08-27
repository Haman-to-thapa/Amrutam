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

type DetailsRouteProp = RouteProp<
    RootStackParamList,
    'DoctorDetails'
>;

export function DoctorDetailsScreen() {
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
        <View style={styles.container}>
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
                        <View style={styles.profile}>
                            <Image
                                source={{ uri: doctor.avatarUrl }}
                                style={styles.avatar}
                            />

                            <Text style={styles.name}>
                                {doctor.name}
                            </Text>

                            <Text style={styles.specialization}>
                                {doctor.specialization}
                            </Text>

                            <Text style={styles.info}>
                                {doctor.experienceYears} years experience
                            </Text>

                            <Text style={styles.info}>
                                ⭐ {doctor.rating} ({doctor.reviewCount}{' '}
                                reviews)
                            </Text>

                            <Text style={styles.info}>
                                ₹{doctor.consultationFee} consultation
                            </Text>

                            <Text style={styles.bio}>
                                {doctor.bio}
                            </Text>
                        </View>

                        <Text style={styles.sectionTitle}>
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
                                            selected && styles.selectedDate,
                                        ]}>
                                        {formatDateLabel(item)}
                                    </Text>
                                );
                            }}
                        />

                        <Text style={styles.sectionTitle}>
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
        alignItems: 'center',
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#eee',
    },

    name: {
        marginTop: 12,
        fontSize: 22,
        fontWeight: '700',
    },

    specialization: {
        marginTop: 4,
        fontSize: 15,
    },

    info: {
        marginTop: 5,
        fontSize: 13,
    },

    bio: {
        marginTop: 12,
        textAlign: 'center',
        lineHeight: 20,
    },

    sectionTitle: {
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: '700',
    },

    date: {
        marginLeft: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        backgroundColor: '#eee',
        overflow: 'hidden',
    },

    selectedDate: {
        backgroundColor: '#1f6f43',
        color: '#fff',
    },
});