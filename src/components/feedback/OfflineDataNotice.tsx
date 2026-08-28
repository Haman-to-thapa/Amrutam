import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    visible: boolean;
};

export function OfflineDataNotice({
    visible,
}: Props) {
    const { theme } = useAppTheme();

    if (!visible) {
        return null;
    }

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.mode === 'dark' ? '#3d2800' : '#fef3c7',
                    borderBottomColor: theme.mode === 'dark' ? '#5a3d00' : '#fde68a',
                },
            ]}>
            <Text style={styles.icon}>📡</Text>
            <Text
                style={[
                    styles.text,
                    {
                        color: theme.mode === 'dark' ? '#fcd34d' : '#92400e',
                    },
                ]}>
                Showing offline cached data. Some information may be outdated.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
    },

    icon: {
        fontSize: 14,
        marginRight: 8,
    },

    text: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
    },
});

