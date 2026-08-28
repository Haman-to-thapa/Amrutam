import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConsultationNavigator } from './ConsultationNavigator';
import { ShopNavigator } from './ShopNavigator';
import { HealthRecordsNavigator } from './HealthRecordsNavigator';

export type MainTabParamList = {
    Consultation: undefined;
    Shop: undefined;
    HealthRecords: undefined;
};

const Tab =
    createBottomTabNavigator<MainTabParamList>();

type TabIconProps = {
    focused: boolean;
    emoji: string;
};

function TabIcon({ focused, emoji }: TabIconProps) {
    return (
        <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
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

export function MainTabs() {
    const insets = useSafeAreaInsets();
    const bottomPadding = Math.max(insets.bottom, 10);
    const tabHeight = 56 + bottomPadding;

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#1f6f43',
                tabBarInactiveTintColor: '#6b7280',
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: tabHeight,
                        paddingBottom: bottomPadding,
                    },
                ],
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarItemStyle: styles.tabBarItem,
            }}>

            <Tab.Screen
                name="Consultation"
                component={ConsultationNavigator}
                options={{
                    headerShown: false,
                    title: 'Consultation',
                    tabBarIcon: ConsultationTabIcon,
                }}
            />

            <Tab.Screen
                name="Shop"
                component={ShopNavigator}
                options={{
                    headerShown: false,
                    title: 'Shop',
                    tabBarIcon: ShopTabIcon,
                }}
            />

            <Tab.Screen
                name="HealthRecords"
                component={HealthRecordsNavigator}
                options={{
                    headerShown: false,
                    title: 'Health Records',
                    tabBarIcon: HealthRecordsTabIcon,
                }}
            />
        </Tab.Navigator>
    );
}


const styles = StyleSheet.create({
    tabBar: {
        height: 64,
        paddingBottom: 8,
        paddingTop: 6,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    tabBarItem: {
        paddingVertical: 2,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    iconContainer: {
        width: 36,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
    },
    activeIconContainer: {
        backgroundColor: '#e8f5e9',
    },
    iconText: {
        fontSize: 20,
    },
    activeIconText: {
        fontSize: 21,
    },
});