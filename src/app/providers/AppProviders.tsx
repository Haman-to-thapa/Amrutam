import React, { PropsWithChildren } from 'react';

import { ReduxProvider } from './ReduxProvider';

export function AppProviders({ children }: PropsWithChildren) {
    return <ReduxProvider>{children}</ReduxProvider>;
}