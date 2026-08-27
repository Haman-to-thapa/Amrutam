import React from 'react';
import { SafeAreaView, Text } from 'react-native';

import { AppProviders } from '@/app/providers/AppProviders';
import { mockDatabase } from '@/mocks/db/mockDatabase';

export default function App() {
  return (
    <AppProviders>
      <SafeAreaView>
        <Text>
          Doctors: {mockDatabase.doctors.length}
        </Text>

        <Text>
          Products: {mockDatabase.products.length}
        </Text>

        <Text>
          Health Records: {mockDatabase.healthRecords.length}
        </Text>
      </SafeAreaView>
    </AppProviders>
  );
}