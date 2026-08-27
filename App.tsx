import React from 'react';
import { SafeAreaView, Text } from 'react-native';

import { AppProviders } from '@/app/providers/AppProviders';
import { useAppSelector } from '@/store/hooks';

function AppContent() {
  const initialized = useAppSelector(state => state.appTest.initialized);

  return (
    <SafeAreaView>
      <Text>{initialized ? 'Redux Connected' : 'Redux Failed'}</Text>
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