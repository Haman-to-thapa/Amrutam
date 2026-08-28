import React, { useCallback, useMemo, useState } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

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
import { useDoctorDetails } from '../hooks/useDoctorDetails';
import { SlotCard } from '../components/SlotCard';

import type { DoctorSlot } from '../types/consultation.types';
import type { RootStackParamList } from '@/app/navigation/RootNavigator';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isSlotBookable } from '../utils/slotUtils';

import { useAppTheme } from '@/app/providers/ThemeProvider';
import { useLanguage } from '@/app/providers/LanguageProvider';

type DetailsRouteProp = RouteProp<
    RootStackParamList,
    'DoctorDetails'
>;

export function DoctorDetailsScreen() {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const insets = useSafeAreaInsets();
    const { theme } = useAppTheme();
    const route = useRoute<DetailsRouteProp>();

    const navigation =
        useNavigation<
            NativeStackNavigationProp<RootStackParamList>
        >();

    const doctorId = route.params.doctorId ?? route.params.doctor?.id ?? '';
    const initialDoctor = route.params.doctor;

    const {
        data: fetchedDoctor,
        isLoading: isDoctorLoading,
        isError: isDoctorError,
        refetch: refetchDoctor,
    } = useDoctorDetails(doctorId);

    const doctor = initialDoctor ?? fetchedDoctor;

    const specializationText = doctor
        ? t(`specializations.${doctor.specialization}` as const, {
            defaultValue: doctor.specialization,
        })
        : '';

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
        isLoading: isSlotsLoading,
        isError: isSlotsError,
        error: slotsError,
        refetch: refetchSlots,
    } = useDoctorSlots({
        doctorId: doctor?.id ?? doctorId,
        date: dateParam,
    });

    const handleSlotPress = useCallback(
        (slot: DoctorSlot) => {
            if (!doctor || !isSlotBookable(slot)) {
                return;
            }

            navigation.navigate('BookingConfirmation', {
                doctor,
                slot,
            });
        },
        [doctor, navigation],
    );

    if (isDoctorLoading && !doctor) {
        return <LoadingState />;
    }

    if (isDoctorError && !doctor) {
        return (
            <ErrorState
                message="Unable to load doctor profile."
                onRetry={refetchDoctor}
            />
        );
    }

    if (!doctor) {
        return (
            <EmptyState
                title={t('consultation.noDoctors')}
                message={t('consultation.noDoctorsDesc')}
            />
        );
    }

    if (isSlotsLoading) {
        return <LoadingState />;
    }

    if (isSlotsError) {
        return (
            <ErrorState
                message={
                    slotsError &&
                        typeof slotsError === 'object' &&
                        'error' in slotsError &&
                        typeof slotsError.error === 'string'
                        ? slotsError.error
                        : 'Unable to load slots.'
                }
                onRetry={refetchSlots}
            />
        );
    }

    const dateLocale = language === 'hi' ? 'hi-IN' : 'en-IN';

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
                            <View style={[styles.avatarWrapper, { backgroundColor: theme.mode === 'dark' ? '#27272a' : '#f3f4f6' }]}>
                                {doctor.avatarUrl ? (
                                    <Image
                                        source={{ uri: doctor.avatarUrl }}
                                        style={styles.avatar}
                                    />
                                ) : (
                                    <Text style={styles.avatarFallback}>👨‍⚕️</Text>
                                )}
                            </View>

                            <Text style={[styles.name, { color: theme.colors.text }]}>
                                {doctor.name}
                            </Text>

                            <Text style={[styles.specialization, { color: theme.colors.primary }]}>
                                {specializationText}
                            </Text>

                            <Text style={[styles.info, { color: theme.colors.textSecondary }]}>
                                {doctor.experienceYears} {t('consultation.experience')}
                            </Text>

                            <Text style={[styles.info, { color: theme.colors.textSecondary }]}>
                                ⭐ {doctor.rating} ({doctor.reviewCount} {t('consultation.reviews')})
                            </Text>

                            <Text style={[styles.feeText, { color: theme.colors.text }]}>
                                ₹{doctor.consultationFee} {t('consultation.fee')}
                            </Text>

                            {doctor.bio ? (
                                <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
                                    {doctor.bio}
                                </Text>
                            ) : null}
                        </View>

                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {t('consultation.selectDate')}
                        </Text>

                        <FlashList
                            horizontal
                            data={dates}
                            keyExtractor={item => item.toISOString()}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.datesList}
                            renderItem={({ item }) => {
                                const selected =
                                    item.toISOString() === selectedDate.toISOString();

                                return (
                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityLabel={`Select date ${formatDateLabel(item, dateLocale)}`}
                                        onPress={() => setSelectedDate(item)}
                                        style={[
                                            styles.dateChip,
                                            {
                                                backgroundColor: selected
                                                    ? theme.colors.primary
                                                    : theme.colors.surface,
                                                borderColor: selected
                                                    ? theme.colors.primary
                                                    : theme.colors.border,
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                styles.dateChipText,
                                                {
                                                    color: selected
                                                        ? '#FFFFFF'
                                                        : theme.colors.text,
                                                },
                                            ]}>
                                            {formatDateLabel(item, dateLocale)}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                        />

                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {t('consultation.availableSlots')}
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <EmptyState
                        title={t('consultation.noSlots')}
                        message={t('consultation.noSlotsDesc')}
                    />
                }
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: insets.bottom + 120 },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 10,
        paddingBottom: 24,
    },

    profile: {
        padding: 20,
        marginHorizontal: 6,
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

    avatarWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    avatarFallback: {
        fontSize: 48,
    },

    name: {
        marginTop: 12,
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
    },

    specialization: {
        marginTop: 4,
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
    },

    info: {
        marginTop: 5,
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },

    feeText: {
        marginTop: 6,
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
    },

    bio: {
        marginTop: 12,
        textAlign: 'center',
        lineHeight: 20,
        fontSize: 13,
    },

    sectionTitle: {
        marginHorizontal: 6,
        marginTop: 16,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: '700',
    },

    datesList: {
        paddingHorizontal: 6,
        paddingBottom: 4,
    },

    dateChip: {
        marginRight: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    dateChipText: {
        fontSize: 13,
        fontWeight: '700',
    },
});
