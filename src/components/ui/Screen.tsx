import React from 'react';
import {
    StyleSheet,
    View,
    type ViewProps,
} from 'react-native';

import { useAppTheme } from '@/app/providers/ThemeProvider';

export function Screen({
    style,
    children,
    ...props
}: ViewProps) {
    const { theme } = useAppTheme();

    return (
        <View
            {...props}
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.background,
                },
                style,
            ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
