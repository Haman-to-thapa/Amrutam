import React from 'react';
import {
    NavigationContainer,
} from '@react-navigation/native';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { DoctorListScreen } from '@/features/consultations/screens/DoctorListScreen';
import { DoctorDetailsScreen } from '@/features/consultations/screens/DoctorDetailsScreen';
import type { Doctor, DoctorSlot } from '@/features/consultations/types/consultation.types';
import { BookingConfirmationScreen } from '@/features/consultations/screens/BookingConfirmationScreen';
import { UpcomingConsultationScreen } from '@/features/consultations/screens/UpcomingConsultationScreen';
import { ProductListScreen } from '@/features/shop/screens/ProductListScreen';

export type RootStackParamList = {
    Doctors: undefined;
    DoctorDetails: {
        doctor: Doctor;
    };
    BookingConfirmation: {
        doctor: Doctor;
        slot: DoctorSlot;
    };
    UpcomingConsultations: undefined;
    ShopProducts: undefined;
};
const Stack =
    createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Doctors"
                    component={DoctorListScreen}
                    options={{
                        title: 'Consultation',
                    }}
                />
                <Stack.Screen
                    name="ShopProducts"
                    component={ProductListScreen}
                    options={{
                        title: 'Shop',
                    }}
                />
                <Stack.Screen
                    name="DoctorDetails"
                    component={DoctorDetailsScreen}
                    options={{
                        title: 'Doctor Profile',
                    }}
                />
                <Stack.Screen
                    name="BookingConfirmation"
                    component={BookingConfirmationScreen}
                    options={{
                        title: 'Confirm Booking',
                    }}
                />
                <Stack.Screen
                    name="UpcomingConsultations"
                    component={UpcomingConsultationScreen}
                    options={{
                        title: 'Upcoming Consultations',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

