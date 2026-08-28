import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConsultationNavigator } from './ConsultationNavigator';
import { ShopNavigator } from './ShopNavigator';
import { HealthRecordsNavigator } from './HealthRecordsNavigator';
import { SettingsNavigator } from './SettingsNavigator';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/app/providers/ThemeProvider';

export type MainTabParamList = {
    Consultation: undefined;
    Shop: undefined;
    HealthRecords: undefined;
    Settings: undefined;
};

const Tab =
    createBottomTabNavigator<MainTabParamList>();

type TabIconProps = {
    focused: boolean;
    emoji: string;
};

function TabIcon({ focused, emoji }: TabIconProps) {
    const { theme } = useAppTheme();
    const activeBg = theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9';

    return (
        <View style={[styles.iconContainer, focused && { backgroundColor: activeBg }]}>
            <Text style={[styles.iconText, focused && styles.activeIconText]}>{emoji}</Text>
        </View>
    );
}

function ConsultationTabIcon({ focused }: { focused: boolean }) {
    return <TabIcon focused={focused} emoji="🩺" />;
}

function ShopTabIcon({ focused }: { focused: boolean }) {
    return <TabIcon focused={focused} emoji="🛍️" />;
}

function HealthRecordsTabIcon({ focused }: { focused: boolean }) {
    return <TabIcon focused={focused} emoji="📋" />;
}

function SettingsTabIcon({ focused }: { focused: boolean }) {
    return <TabIcon focused={focused} emoji="⚙️" />;
}

export function MainTabs() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { theme } = useAppTheme();

    // Android software 3-button navigation bar requires at least 34-40dp clearance
    const isAndroid = Platform.OS === 'android';
    const bottomPadding = Math.max(insets.bottom, isAndroid ? 36 : 20);
    const tabHeight = 66 + bottomPadding;

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: {
                    height: tabHeight,
                    paddingTop: 8,
                    paddingBottom: bottomPadding,
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700',
                    marginTop: 2,
                    marginBottom: 4,
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 6,
                },
            }}>

            <Tab.Screen
                name="Consultation"
                component={ConsultationNavigator}
                options={{
                    headerShown: false,
                    title: t('nav.consultation'),
                    tabBarIcon: ConsultationTabIcon,
                }}
            />

            <Tab.Screen
                name="Shop"
                component={ShopNavigator}
                options={{
                    headerShown: false,
                    title: t('nav.shop'),
                    tabBarIcon: ShopTabIcon,
                }}
            />

            <Tab.Screen
                name="HealthRecords"
                component={HealthRecordsNavigator}
                options={{
                    headerShown: false,
                    title: t('nav.healthRecords'),
                    tabBarIcon: HealthRecordsTabIcon,
                }}
            />

            <Tab.Screen
                name="Settings"
                component={SettingsNavigator}
                options={{
                    headerShown: false,
                    title: t('nav.settings'),
                    tabBarIcon: SettingsTabIcon,
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 38,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
    },
    iconText: {
        fontSize: 18,
    },
    activeIconText: {
        fontSize: 20,
    },
});
