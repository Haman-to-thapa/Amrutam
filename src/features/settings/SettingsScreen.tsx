import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAppTheme } from '@/app/providers/ThemeProvider';
import type { ThemeMode } from '@/theme/theme.types';

const OPTIONS: readonly {
    value: ThemeMode;
    label: string;
    icon: string;
    description: string;
}[] = [
    {
        value: 'system',
        label: 'System Default',
        icon: '📱',
        description: 'Match system display preferences',
    },
    {
        value: 'light',
        label: 'Light Mode',
        icon: '☀️',
        description: 'Clean, radiant Ayurvedic theme',
    },
    {
        value: 'dark',
        label: 'Dark Mode',
        icon: '🌙',
        description: 'Comfortable contrast for low-light reading',
    },
];

export function SettingsScreen() {
    const {
        theme,
        mode,
        setMode,
    } = useAppTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.background,
                },
            ]}>
            <Text
                style={[
                    styles.title,
                    {
                        color: theme.colors.text,
                    },
                ]}>
                Appearance
            </Text>
            <Text
                style={[
                    styles.subtitle,
                    {
                        color: theme.colors.textSecondary,
                    },
                ]}>
                Customize your viewing experience across the entire Amrutam app.
            </Text>

            <View style={styles.optionsContainer}>
                {OPTIONS.map(option => {
                    const selected = mode === option.value;

                    return (
                        <Pressable
                            key={option.value}
                            accessibilityRole="radio"
                            accessibilityState={{
                                selected,
                            }}
                            accessibilityLabel={option.label}
                            onPress={() => setMode(option.value)}
                            style={[
                                styles.option,
                                {
                                    backgroundColor: theme.colors.surface,
                                    borderColor: selected
                                        ? theme.colors.primary
                                        : theme.colors.border,
                                },
                            ]}>
                            <View style={styles.optionLeft}>
                                <Text style={styles.optionIcon}>{option.icon}</Text>
                                <View style={styles.optionTextContainer}>
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            {
                                                color: theme.colors.text,
                                            },
                                        ]}>
                                        {option.label}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.optionDesc,
                                            {
                                                color: theme.colors.textSecondary,
                                            },
                                        ]}>
                                        {option.description}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.radioCircle,
                                    {
                                        borderColor: selected
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                    },
                                ]}>
                                {selected ? (
                                    <View
                                        style={[
                                            styles.radioDot,
                                            {
                                                backgroundColor: theme.colors.primary,
                                            },
                                        ]}
                                    />
                                ) : null}
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
    },

    subtitle: {
        fontSize: 13,
        marginTop: 4,
        marginBottom: 20,
        lineHeight: 18,
    },

    optionsContainer: {
        gap: 12,
    },

    option: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },

    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },

    optionIcon: {
        fontSize: 22,
        marginRight: 14,
    },

    optionTextContainer: {
        flex: 1,
    },

    optionLabel: {
        fontSize: 16,
        fontWeight: '700',
    },

    optionDesc: {
        fontSize: 12,
        marginTop: 2,
    },

    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    radioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
