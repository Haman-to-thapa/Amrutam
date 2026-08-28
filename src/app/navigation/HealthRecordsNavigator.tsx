import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { HealthRecordsScreen } from '@/features/health-records/screens/HealthRecordsScreen';
import { HealthRecordDetailsScreen } from '@/features/health-records/screens/HealthRecordDetailsScreen';
import { useAppTheme } from '@/app/providers/ThemeProvider';

export type HealthRecordsStackParamList = {
    HealthRecords: undefined;
    HealthRecordDetails: {
        recordId: string;
    };
};

const Stack =
    createNativeStackNavigator<HealthRecordsStackParamList>();

export function HealthRecordsNavigator() {
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
                name="HealthRecords"
                component={HealthRecordsScreen}
                options={{ title: 'Health Records' }}
            />
            <Stack.Screen
                name="HealthRecordDetails"
                component={HealthRecordDetailsScreen}
                options={{ title: 'Record Details' }}
            />
        </Stack.Navigator>
    );
}
