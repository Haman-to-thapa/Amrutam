import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { MainTabs } from './MainTabs';
import { linking } from './linking';

export type { ConsultationStackParamList, ConsultationStackParamList as RootStackParamList } from './ConsultationNavigator';
export type { ShopStackParamList } from './ShopNavigator';
export type { HealthRecordsStackParamList } from './HealthRecordsNavigator';
export type { MainTabParamList } from './MainTabs';

export function RootNavigator() {
    return (
        <NavigationContainer linking={linking}>
            <MainTabs />
        </NavigationContainer>
    );
}




