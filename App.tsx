import React from 'react';
import { Pressable, SafeAreaView, Text } from 'react-native';

import { AppProviders } from '@/app/providers/AppProviders';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';

function AppContent() {
  const dispatch = useAppDispatch();

  const handleTest = () => {
    dispatch(
      showToast({
        type: 'success',
        message: 'Amrutam toast working',
      }),
    );
  };

  return (
    <SafeAreaView>
      <Text>Amrutam</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Test toast"
        onPress={handleTest}>
        <Text>Test Toast</Text>
      </Pressable>
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