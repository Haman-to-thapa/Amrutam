import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ReduxProvider } from './ReduxProvider';

import { ThemeProvider } from './ThemeProvider';
import { PersistenceBridge } from './PersistenceBridge';
import { SyncBridge } from './SyncBridge';
import { Toast } from '@/components/feedback/Toast';

export function AppProviders({ children }: PropsWithChildren) {
    return (
        <SafeAreaProvider>
            <ReduxProvider>
                <ThemeProvider>
                    <PersistenceBridge>
                        <SyncBridge />
                        {children}
                        <Toast />
                    </PersistenceBridge>
                </ThemeProvider>
            </ReduxProvider>
        </SafeAreaProvider>
    );
}



