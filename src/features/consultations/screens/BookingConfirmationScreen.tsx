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
import { Input } from '@/components/ui/Input';
import { useCreateBookingMutation } from '../api/consultationApi';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';

type BookingRouteProp = RouteProp<
    RootStackParamList,
    'BookingConfirmation'
>;

export function BookingConfirmationScreen() {
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

    const formattedDate = useMemo(
        () =>
            new Date(slot.startsAt).toLocaleDateString(
                'en-IN',
                {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                },
            ),
        [slot.startsAt],
    );

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

        try {
            await createBooking({
                doctorId: doctor.id,
                slotId: slot.id,
                patientName: name,
                mode: slot.mode,
                date: formatDateParam(new Date(slot.startsAt)),
            }).unwrap();

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
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets={true}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.heading}>
                    Confirm Consultation
                </Text>

                {/* Doctor & Appointment Summary Card */}
                <View style={styles.card}>
                    <View style={styles.doctorHeader}>
                        <View style={styles.avatarMini}>
                            <Text style={styles.avatarText}>
                                {doctor.name.replace('Dr. ', '').charAt(0)}
                            </Text>
                        </View>
                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>{doctor.name}</Text>
                            <Text style={styles.specialization}>
                                {doctor.specialization}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.value}>{formattedDate}</Text>
                        </View>

                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Time</Text>
                            <Text style={styles.value}>
                                {formatTime(slot.startsAt)}
                            </Text>
                        </View>

                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Mode</Text>
                            <Text style={[styles.value, styles.capitalize]}>
                                {slot.mode}
                            </Text>
                        </View>

                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Fee</Text>
                            <Text style={[styles.value, styles.feeValue]}>
                                ₹{doctor.consultationFee}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Patient Information Card */}
                <View style={[styles.card, styles.patientCard]}>
                    <Text style={styles.sectionHeading}>Patient Details</Text>
                    <Text style={styles.label}>Full Name *</Text>
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
        backgroundColor: '#f8f9fa',
    },

    scrollContent: {
        padding: 16,
        paddingBottom: 320,
    },

    heading: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 14,
        color: '#111827',
    },

    card: {
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#fff',
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
        backgroundColor: '#e6f4ea',
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f6f43',
    },

    doctorInfo: {
        marginLeft: 12,
        flex: 1,
    },

    doctorName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },

    specialization: {
        marginTop: 2,
        fontSize: 13,
        color: '#6b7280',
    },

    divider: {
        height: 1,
        backgroundColor: '#f1f3f5',
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
        color: '#6b7280',
        marginBottom: 2,
    },

    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },

    capitalize: {
        textTransform: 'capitalize',
    },

    feeValue: {
        color: '#1f6f43',
        fontWeight: '700',
    },

    patientCard: {
        marginTop: 14,
    },

    sectionHeading: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 10,
    },

    input: {
        marginHorizontal: 0,
        marginTop: 6,
        marginBottom: 0,
        backgroundColor: '#f9fafb',
    },

    button: {
        marginTop: 20,
        minHeight: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f6f43',
        elevation: 2,
    },

    disabledButton: {
        opacity: 0.5,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

