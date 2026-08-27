import React, { useMemo, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import type { RootStackParamList } from '@/app/navigation/RootNavigator';
import { formatTime } from '@/core/utils/date';
import { Input } from '@/components/ui/Input';

type BookingRouteProp = RouteProp<
    RootStackParamList,
    'BookingConfirmation'
>;

export function BookingConfirmationScreen() {
    const route = useRoute<BookingRouteProp>();

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

    const handleConfirm = () => {
        // Actual booking mutation will be implemented in Step 21.
    };

    const canConfirm = patientName.trim().length >= 2;

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Confirm Consultation
            </Text>

            <View style={styles.card}>
                <Text style={styles.label}>Doctor</Text>
                <Text style={styles.value}>{doctor.name}</Text>

                <Text style={styles.label}>Specialization</Text>
                <Text style={styles.value}>
                    {doctor.specialization}
                </Text>

                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>
                    {formattedDate}
                </Text>

                <Text style={styles.label}>Time</Text>
                <Text style={styles.value}>
                    {formatTime(slot.startsAt)}
                </Text>

                <Text style={styles.label}>Mode</Text>
                <Text style={styles.value}>{slot.mode}</Text>

                <Text style={styles.label}>Consultation Fee</Text>
                <Text style={styles.value}>
                    ₹{doctor.consultationFee}
                </Text>

                <Text style={styles.label}>Patient Name</Text>
                <Input
                    value={patientName}
                    onChangeText={setPatientName}
                    placeholder="Enter patient name"
                    accessibilityLabel="Patient name"
                    style={styles.input}
                />
            </View>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Confirm consultation booking"
                disabled={!canConfirm}
                onPress={handleConfirm}
                style={[
                    styles.button,
                    !canConfirm && styles.disabledButton,
                ]}>
                <Text style={styles.buttonText}>
                    Confirm & Book
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    heading: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
    },

    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },

    label: {
        marginTop: 12,
        fontSize: 12,
        color: '#666',
    },

    value: {
        marginTop: 3,
        fontSize: 16,
        fontWeight: '600',
    },

    input: {
        marginHorizontal: 0,
        marginTop: 6,
        marginBottom: 0,
    },

    button: {
        marginTop: 20,
        minHeight: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f6f43',
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