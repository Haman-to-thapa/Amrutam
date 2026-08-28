import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { DoctorListScreen } from '@/features/consultations/screens/DoctorListScreen';
import { DoctorDetailsScreen } from '@/features/consultations/screens/DoctorDetailsScreen';
import { BookingConfirmationScreen } from '@/features/consultations/screens/BookingConfirmationScreen';
import { UpcomingConsultationScreen } from '@/features/consultations/screens/UpcomingConsultationScreen';

import { useAppTheme } from '@/app/providers/ThemeProvider';
import type { Doctor, DoctorSlot } from '@/features/consultations/types/consultation.types';

export type ConsultationStackParamList = {
    Doctors: undefined;
    DoctorDetails: {
        doctorId: string;
        doctor?: Doctor;
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
    const { theme } = useAppTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                },
                contentStyle: {
                    backgroundColor: theme.colors.background,
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