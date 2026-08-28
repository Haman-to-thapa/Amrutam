import React, { memo } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';

import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    accessibilityLabel?: string;
};

function ButtonComponent({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    accessibilityLabel,
}: Props) {
    const { theme } = useAppTheme();

    const backgroundColor =
        variant === 'danger'
            ? theme.colors.danger
            : variant === 'secondary'
                ? theme.colors.surface
                : theme.colors.primary;

    const textColor =
        variant === 'secondary'
            ? theme.colors.text
            : '#FFFFFF';

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? title}
            accessibilityState={{
                disabled: disabled || loading,
                busy: loading,
            }}
            disabled={disabled || loading}
            onPress={onPress}
            style={[
                styles.button,
                {
                    backgroundColor,
                    borderColor: theme.colors.border,
                },
                (disabled || loading) && styles.disabled,
            ]}>
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        { color: textColor },
                    ]}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

export const Button = memo(
    ButtonComponent,
);

const styles = StyleSheet.create({
    button: {
        minHeight: 48,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
    },

    text: {
        fontSize: 15,
        fontWeight: '700',
    },

    disabled: {
        opacity: 0.5,
    },
});
