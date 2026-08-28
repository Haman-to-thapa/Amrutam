import React, { memo } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';

import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    label: string;
    selected?: boolean;
    onPress: () => void;
    accessibilityLabel?: string;
};

function ChipComponent({
    label,
    selected = false,
    onPress,
    accessibilityLabel,
}: Props) {
    const { theme } = useAppTheme();

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityState={{
                selected,
            }}
            onPress={onPress}
            style={[
                styles.chip,
                {
                    backgroundColor: selected
                        ? theme.colors.primary
                        : theme.colors.surface,
                    borderColor: selected
                        ? theme.colors.primary
                        : theme.colors.border,
                },
            ]}>
            <Text
                style={[
                    styles.text,
                    {
                        color: selected
                            ? '#FFFFFF'
                            : theme.colors.text,
                    },
                ]}>
                {label}
            </Text>
        </Pressable>
    );
}

export const Chip = memo(
    ChipComponent,
);

const styles = StyleSheet.create({
    chip: {
        minHeight: 36,
        paddingHorizontal: 13,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 18,
    },

    text: {
        fontSize: 12,
        fontWeight: '600',
    },
});
