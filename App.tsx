import React from 'react';
import { SafeAreaView, Text } from 'react-native';

import { AppProviders } from '@/app/providers/AppProviders';
import { ErrorBoundary } from '@/core/errors/ErrorBoundary';

function AppContent() {
  return (
    <SafeAreaView>
      <Text>Amrutam</Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </ErrorBoundary>
  );
}