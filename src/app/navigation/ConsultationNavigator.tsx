import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { DoctorListScreen } from '@/features/consultations/screens/DoctorListScreen';
import { DoctorDetailsScreen } from '@/features/consultations/screens/DoctorDetailsScreen';
import { BookingConfirmationScreen } from '@/features/consultations/screens/BookingConfirmationScreen';
import { UpcomingConsultationScreen } from '@/features/consultations/screens/UpcomingConsultationScreen';

import type { Doctor, DoctorSlot } from '@/features/consultations/types/consultation.types';

export type ConsultationStackParamList = {
    Doctors: undefined;
    DoctorDetails: {
        doctor: Doctor;
    };
    BookingConfirmation: {
        doctor: Doctor;
        slot: DoctorSlot;
    };
    UpcomingConsultations: undefined;
};

const Stack =
    createNativeStackNavigator<ConsultationStackParamList>();

export function ConsultationNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#ffffff',
                },
                headerTintColor: '#111827',
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                },
                headerShadowVisible: true,
            }}>
            <Stack.Screen
                name="Doctors"
                component={DoctorListScreen}
                options={{ title: 'Consultation' }}
            />


            <Stack.Screen
                name="DoctorDetails"
                component={DoctorDetailsScreen}
                options={{ title: 'Doctor Details' }}
            />

            <Stack.Screen
                name="BookingConfirmation"
                component={BookingConfirmationScreen}
                options={{ title: 'Confirm Booking' }}
            />

            <Stack.Screen
                name="UpcomingConsultations"
                component={UpcomingConsultationScreen}
                options={{ title: 'Upcoming Consultations' }}
            />
        </Stack.Navigator>
    );
}