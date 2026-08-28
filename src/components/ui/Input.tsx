import React, { memo } from 'react';
import {
    StyleSheet,
    TextInput,
    type TextInputProps,
} from 'react-native';

import { useAppTheme } from '@/app/providers/ThemeProvider';

function InputComponent({
    style,
    ...props
}: TextInputProps) {
    const { theme } = useAppTheme();

    return (
        <TextInput
            {...props}
            placeholderTextColor={
                theme.colors.textSecondary
            }
            selectionColor={
                theme.colors.primary
            }
            style={[
                styles.input,
                {
                    color: theme.colors.text,
                    backgroundColor:
                        theme.colors.surface,
                    borderColor:
                        theme.colors.border,
                },
                style,
            ]}
        />
    );
}

export const Input = memo(
    InputComponent,
);

const styles = StyleSheet.create({
    input: {
        minHeight: 48,
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 15,
    },
});