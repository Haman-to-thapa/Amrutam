import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    title: string;
    message: string;
};

export function EmptyState({
    title,
    message,
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
                {title}
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
});