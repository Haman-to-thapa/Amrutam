import React, { memo } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAppSelector } from '@/store/hooks';
import {
    selectConflictCount,
    selectFailedSyncCount,
    selectSyncingCount,
} from '@/store/selectors/syncSelectors';
import { useAppTheme } from '@/app/providers/ThemeProvider';

function SyncStatusComponent() {
    const { theme } = useAppTheme();
    const syncingCount = useAppSelector(selectSyncingCount);
    const failedCount = useAppSelector(selectFailedSyncCount);
    const conflictCount = useAppSelector(selectConflictCount);

    if (conflictCount > 0) {
        return (
            <View
                accessibilityRole="alert"
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.mode === 'dark' ? '#3b1818' : '#fee2e2',
                        borderBottomColor: theme.mode === 'dark' ? '#5c2222' : '#fecaca',
                    },
                ]}>
                <Text style={styles.icon}>⚠️</Text>
                <Text style={[styles.text, { color: theme.colors.danger }]}>
                    {conflictCount} booking{conflictCount > 1 ? 's need' : ' needs'} attention due to slot conflicts.
                </Text>
            </View>
        );
    }

    if (syncingCount > 0) {
        return (
            <View
                accessibilityRole="alert"
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#ecfdf5',
                        borderBottomColor: theme.mode === 'dark' ? '#2d573d' : '#a7f3d0',
                    },
                ]}>
                <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                    style={styles.spinner}
                />
                <Text style={[styles.text, { color: theme.colors.primary }]}>
                    Syncing {syncingCount} booking{syncingCount > 1 ? 's' : ''}...
                </Text>
            </View>
        );
    }

    if (failedCount > 0) {
        return (
            <View
                accessibilityRole="alert"
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.mode === 'dark' ? '#3b2f15' : '#fef3c7',
                        borderBottomColor: theme.mode === 'dark' ? '#5c4820' : '#fde68a',
                    },
                ]}>
                <Text style={styles.icon}>⏳</Text>
                <Text style={[styles.text, { color: theme.mode === 'dark' ? '#fbbf24' : '#92400e' }]}>
                    {failedCount} booking{failedCount > 1 ? 's' : ''} waiting to retry sync.
                </Text>
            </View>
        );
    }

    return null;
}

export const SyncStatus = memo(SyncStatusComponent);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderBottomWidth: 1,
        zIndex: 998,
    },

    icon: {
        fontSize: 13,
        marginRight: 6,
    },

    spinner: {
        marginRight: 8,
    },

    text: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});
