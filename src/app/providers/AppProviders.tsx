import React, { PropsWithChildren } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ReduxProvider } from './ReduxProvider';
import { PersistenceBridge } from './PersistenceBridge';
import { Toast } from '@/components/feedback/Toast';

export function AppProviders({ children }: PropsWithChildren) {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="dark-content" />
            <ReduxProvider>
                <PersistenceBridge>
                    {children}
                    <Toast />
                </PersistenceBridge>
            </ReduxProvider>
        </SafeAreaProvider>
    );
}

