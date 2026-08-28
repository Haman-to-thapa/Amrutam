import React from 'react';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { useAppTheme } from '@/app/providers/ThemeProvider';

export type SettingsStackParamList = {
    Settings: undefined;
};

const Stack =
    createNativeStackNavigator<SettingsStackParamList>();

export function SettingsNavigator() {
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
                headerShadowVisible: true,
            }}>
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                }}
            />
        </Stack.Navigator>
    );
}
