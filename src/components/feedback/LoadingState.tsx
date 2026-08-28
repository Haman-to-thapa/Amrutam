import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAppTheme } from '@/app/providers/ThemeProvider';

export function LoadingState() {
    const { theme } = useAppTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.colors.background,
                },
            ]}>
            <ActivityIndicator
                color={theme.colors.primary}
                size="large"
            />

            <Text
                style={[
                    styles.text,
                    {
                        color:
                            theme.colors.textSecondary,
                    },
                ]}>
                Loading...
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    text: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '500',
    },
});