import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import '@/core/i18n/i18n';

import { AppProviders } from '@/app/providers/AppProviders';
import { useAppTheme } from '@/app/providers/ThemeProvider';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { OfflineBanner } from '@/components/feedback/OfflineBanner';
import { SyncStatus } from '@/components/feedback/SyncStatus';

function AppContent() {
    const { theme } = useAppTheme();
    const isDark = theme.mode === 'dark';

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
            />
            <OfflineBanner />
            <SyncStatus />
            <View style={styles.navigation}>
                <RootNavigator />
            </View>
        </View>
    );

}

export default function App() {
    return (
        <AppProviders>
            <AppContent />
        </AppProviders>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    navigation: {
        flex: 1,
    },
});