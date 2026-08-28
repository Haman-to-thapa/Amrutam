import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { HealthRecordsPlaceholderScreen } from '@/features/health-records/screens/HealthRecordsPlaceholderScreen';

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
                component={HealthRecordsPlaceholderScreen}
                options={{ title: 'Health Records' }}
            />
        </Stack.Navigator>
    );
}