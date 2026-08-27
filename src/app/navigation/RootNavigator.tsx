import React from 'react';
import {
    NavigationContainer,
} from '@react-navigation/native';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { DoctorListScreen } from '@/features/consultations/screens/DoctorListScreen';

export type RootStackParamList = {
    Doctors: undefined;
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}