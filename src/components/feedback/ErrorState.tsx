import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    message: string;
    onRetry: () => void;
};

export function ErrorState({
    message,
    onRetry,
}: Props) {
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
            <Text
                style={[
                    styles.title,
                    {
                        color: theme.colors.text,
                    },
                ]}>
                Unable to load
            </Text>

            <Text
                style={[
                    styles.message,
                    {
                        color:
                            theme.colors.textSecondary,
                    },
                ]}>
                {message}
            </Text>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Retry"
                onPress={onRetry}
                style={[
                    styles.button,
                    {
                        backgroundColor:
                            theme.colors.primary,
                    },
                ]}>
                <Text style={styles.buttonText}>
                    Retry
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
    },

    message: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },

    button: {
        marginTop: 16,
        minHeight: 44,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
    },

    buttonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 14,
    },
});