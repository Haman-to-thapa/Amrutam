import React from 'react';
import { SafeAreaView, Text } from 'react-native';

import { AppProviders } from '@/app/providers/AppProviders';
import { useNetworkStatus } from '@/core/network/useNetworkStatus';

function AppContent() {
  const {
    isConnected,
    isInternetReachable,
    type,
  } = useNetworkStatus();

  return (
    <SafeAreaView>
      <Text>
        Connection: {isConnected ? 'Connected' : 'Disconnected'}
      </Text>

      <Text>
        Internet:{' '}
        {isInternetReachable === null
          ? 'Checking...'
          : isInternetReachable
            ? 'Available'
            : 'Unavailable'}
      </Text>

      <Text>Type: {type}</Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}