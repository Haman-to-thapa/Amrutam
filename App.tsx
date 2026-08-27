import React from 'react';
import { SafeAreaView, Text } from 'react-native';

import { AppProviders } from '@/app/providers/AppProviders';
import { storageService } from '@/core/storage/storage';
import { STORAGE_KEYS } from '@/core/storage/storageKeys';

function AppContent() {
  const handleStorageTest = () => {
    storageService.setJson(STORAGE_KEYS.THEME, {
      mode: 'dark',
    });

    const result = storageService.getJson<{ mode: string }>(
      STORAGE_KEYS.THEME,
    );

    console.log('Storage test:', result);
  };

  React.useEffect(() => {
    handleStorageTest();
  }, []);

  return (
    <SafeAreaView>
      <Text>Storage Layer Ready</Text>
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