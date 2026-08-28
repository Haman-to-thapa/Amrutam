import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ReduxProvider } from './ReduxProvider';

import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import { PersistenceBridge } from './PersistenceBridge';
import { SyncBridge } from './SyncBridge';
import { NetworkBridge } from './NetworkBridge';
import { Toast } from '@/components/feedback/Toast';

export function AppProviders({ children }: PropsWithChildren) {
    return (
        <SafeAreaProvider>
            <ReduxProvider>
                <ThemeProvider>
                    <LanguageProvider>
                        <PersistenceBridge>
                            <NetworkBridge />
                            <SyncBridge />
                            {children}
                            <Toast />
                        </PersistenceBridge>
                    </LanguageProvider>
                </ThemeProvider>
            </ReduxProvider>
        </SafeAreaProvider>
    );
}





