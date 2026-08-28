import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAppSelector } from '@/store/hooks';
import { selectIsOffline } from '@/store/selectors/networkSelectors';
import { useAppTheme } from '@/app/providers/ThemeProvider';

function OfflineBannerComponent() {
    const { theme } = useAppTheme();
    const isOffline = useAppSelector(selectIsOffline);

    if (!isOffline) {
        return null;
    }

    return (
        <View
            accessibilityRole="alert"
            accessibilityLabel="Offline banner alert"
            style={[
                styles.container,
                {
                    backgroundColor: theme.mode === 'dark' ? '#27272a' : '#1f2937',
                    borderBottomColor: theme.mode === 'dark' ? '#3f3f46' : '#374151',
                },
            ]}>
            <Text style={styles.icon}>📡</Text>
            <Text style={styles.text}>
                You're offline. Some information may be from your last cached session.
            </Text>
        </View>
    );
}

export const OfflineBanner = memo(OfflineBannerComponent);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 38,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        zIndex: 999,
    },

    icon: {
        fontSize: 13,
        marginRight: 8,
    },

    text: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        flexShrink: 1,
    },
});
