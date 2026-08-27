import React, { PropsWithChildren } from 'react';

import { ReduxProvider } from './ReduxProvider';
import { Toast } from '@/components/feedback/Toast';

export function AppProviders({ children }: PropsWithChildren) {
    return (
        <ReduxProvider>
            {children}
            <Toast />
        </ReduxProvider>
    );
}