import React from 'react';
import {
    StyleSheet,
    View,
    type ViewProps,
} from 'react-native';

import { useAppTheme } from '@/app/providers/ThemeProvider';

export function Card({
    style,
    children,
    ...props
}: ViewProps) {
    const { theme } = useAppTheme();

    return (
        <View
            {...props}
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
                style,
            ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
    },
});
