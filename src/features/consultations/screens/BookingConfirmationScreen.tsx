import React, { useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/navigation/RootNavigator';
import { formatDateParam, formatTime } from '@/core/utils/date';
import { getNetworkStatus } from '@/core/network/network';
import { createIdempotencyKey } from '@/core/utils/idempotency';
import { createBookingQueueItem } from '@/core/sync/bookingQueueService';
import { enqueueBooking } from '@/store/slices/offlineQueueSlice';
import { Input } from '@/components/ui/Input';
import { useCreateBookingMutation } from '../api/consultationApi';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';

import { useAppTheme } from '@/app/providers/ThemeProvider';

type BookingRouteProp = RouteProp<
    RootStackParamList,
    'BookingConfirmation'
>;

export function BookingConfirmationScreen() {
    const { theme } = useAppTheme();
    const route = useRoute<BookingRouteProp>();
    const navigation =
        useNavigation<
            NativeStackNavigationProp<RootStackParamList>
        >();
    const dispatch = useAppDispatch();

    const [
        createBooking,
        {
            isLoading: isBooking,
        },
    ] = useCreateBookingMutation();

    const { doctor, slot } = route.params;

    const [patientName, setPatientName] =
        useState('');

    const formattedDate = useMemo(() => {
        return new Date(slot.startsAt).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }, [slot.startsAt]);

    const handleConfirm = async () => {
        const name = patientName.trim();

        if (name.length < 2) {
            dispatch(
                showToast({
                    type: 'warning',
                    message: 'Please enter a valid patient name.',
                }),
            );

            return;
        }

        const idempotencyKey = createIdempotencyKey(
            `${doctor.id}-${slot.id}`,
        );

        const request = {
            doctorId: doctor.id,
            slotId: slot.id,
            patientName: name,
            mode: slot.mode,
            date: formatDateParam(new Date(slot.startsAt)),
            idempotencyKey,
        };

        const network = await getNetworkStatus();

        if (!network.isConnected || network.isInternetReachable === false) {
            const queueItem = createBookingQueueItem(request);

            dispatch(enqueueBooking(queueItem));

            dispatch(
                showToast({
                    type: 'info',
                    message: 'You are offline. Your booking has been queued and will sync automatically.',
                }),
            );

            navigation.replace('UpcomingConsultations');
            return;
        }

        try {
            await createBooking(request).unwrap();

            dispatch(
                showToast({
                    type: 'success',
                    message: 'Consultation booked successfully.',
                }),
            );

            navigation.replace('UpcomingConsultations');
        } catch (error) {

            const message =
                error &&
                    typeof error === 'object' &&
                    'message' in error &&
                    typeof error.message === 'string'
                    ? error.message
                    : 'Unable to book consultation.';

            dispatch(
                showToast({
                    type: 'error',
                    message,
                }),
            );
        }
    };

    const canConfirm = patientName.trim().length >= 2;


    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets={true}
                showsVerticalScrollIndicator={false}>
                <Text style={[styles.heading, { color: theme.colors.text }]}>
                    Confirm Consultation
                </Text>

                {/* Doctor & Appointment Summary Card */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <View style={styles.doctorHeader}>
                        <View style={[styles.avatarMini, { backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#e6f4ea' }]}>
                            <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                                {doctor.name.replace('Dr. ', '').charAt(0)}
                            </Text>
                        </View>
                        <View style={styles.doctorInfo}>
                            <Text style={[styles.doctorName, { color: theme.colors.text }]}>{doctor.name}</Text>
                            <Text style={[styles.specialization, { color: theme.colors.primary }]}>
                                {doctor.specialization}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Date</Text>
                            <Text style={[styles.value, { color: theme.colors.text }]}>{formattedDate}</Text>
                        </View>

                        <View style={styles.gridItem}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Time</Text>
                            <Text style={[styles.value, { color: theme.colors.text }]}>
                                {formatTime(slot.startsAt)}
                            </Text>
                        </View>

                        <View style={styles.gridItem}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Mode</Text>
                            <Text style={[styles.value, styles.capitalize, { color: theme.colors.text }]}>
                                {slot.mode}
                            </Text>
                        </View>

                        <View style={styles.gridItem}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Fee</Text>
                            <Text style={[styles.value, { color: theme.colors.primary, fontWeight: '700' }]}>
                                ₹{doctor.consultationFee}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Patient Information Card */}
                <View style={[styles.card, styles.patientCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>Patient Details</Text>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Full Name *</Text>
                    <Input
                        value={patientName}
                        onChangeText={setPatientName}
                        placeholder="Enter patient full name"
                        accessibilityLabel="Patient name"
                        style={styles.input}
                    />
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Confirm consultation booking"
                    disabled={!canConfirm || isBooking}
                    onPress={handleConfirm}
                    style={[
                        styles.button,
                        { backgroundColor: theme.colors.primary },
                        (!canConfirm || isBooking) &&
                            styles.disabledButton,
                    ]}>
                    <Text style={styles.buttonText}>
                        {isBooking ? 'Booking...' : 'Confirm & Book'}
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },

    heading: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 14,
    },

    card: {
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },

    doctorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatarMini: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarText: {
        fontSize: 18,
        fontWeight: '700',
    },

    doctorInfo: {
        marginLeft: 12,
        flex: 1,
    },

    doctorName: {
        fontSize: 16,
        fontWeight: '700',
    },

    specialization: {
        marginTop: 2,
        fontSize: 13,
        fontWeight: '600',
    },

    divider: {
        height: 1,
        marginVertical: 12,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    gridItem: {
        width: '50%',
        marginVertical: 6,
    },

    label: {
        fontSize: 12,
        marginBottom: 2,
    },

    value: {
        fontSize: 14,
        fontWeight: '600',
    },

    capitalize: {
        textTransform: 'capitalize',
    },

    patientCard: {
        marginTop: 14,
    },

    sectionHeading: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 10,
    },

    input: {
        marginHorizontal: 0,
        marginTop: 6,
        marginBottom: 0,
    },

    button: {
        marginTop: 20,
        minHeight: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },

    disabledButton: {
        opacity: 0.5,
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});