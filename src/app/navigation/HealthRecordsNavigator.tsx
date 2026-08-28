import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { HealthRecordsScreen } from '@/features/health-records/screens/HealthRecordsScreen';

export type HealthRecordsStackParamList = {
    HealthRecords: undefined;
};

const Stack =
    createNativeStackNavigator<HealthRecordsStackParamList>();

export function HealthRecordsNavigator() {
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
                name="HealthRecords"
                component={HealthRecordsScreen}
                options={{ title: 'Health Records' }}
            />
        </Stack.Navigator>
    );
}