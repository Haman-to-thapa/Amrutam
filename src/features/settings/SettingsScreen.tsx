import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/app/providers/ThemeProvider';
import { useLanguage } from '@/app/providers/LanguageProvider';
import type { ThemeMode } from '@/theme/theme.types';
import type { Language } from '@/store/slices/languageSlice';

export function SettingsScreen() {
    const { t } = useTranslation();
    const {
        theme,
        mode,
        setMode,
    } = useAppTheme();
    const { language, changeLanguage } = useLanguage();

    const THEME_OPTIONS: readonly {
        value: ThemeMode;
        label: string;
        icon: string;
        description: string;
    }[] = [
        {
            value: 'system',
            label: t('settings.system'),
            icon: '📱',
            description: 'Match system display preferences',
        },
        {
            value: 'light',
            label: t('settings.light'),
            icon: '☀️',
            description: 'Clean, radiant Ayurvedic theme',
        },
        {
            value: 'dark',
            label: t('settings.dark'),
            icon: '🌙',
            description: 'Comfortable contrast for low-light reading',
        },
    ];

    const LANGUAGE_OPTIONS: readonly {
        value: Language;
        label: string;
        icon: string;
        nativeName: string;
    }[] = [
        {
            value: 'en',
            label: t('settings.english'),
            icon: '🇬🇧',
            nativeName: 'English (US/UK)',
        },
        {
            value: 'hi',
            label: t('settings.hindi'),
            icon: '🇮🇳',
            nativeName: 'हिंदी (India)',
        },
    ];

    return (
        <ScrollView
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.background,
                },
            ]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            {/* Appearance Section */}
            <Text
                style={[
                    styles.title,
                    {
                        color: theme.colors.text,
                    },
                ]}>
                {t('settings.appearance')}
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
                {THEME_OPTIONS.map(option => {
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

            {/* Language Section */}
            <Text
                style={[
                    styles.title,
                    styles.sectionMarginTop,
                    {
                        color: theme.colors.text,
                    },
                ]}>
                {t('settings.language')}
            </Text>
            <Text
                style={[
                    styles.subtitle,
                    {
                        color: theme.colors.textSecondary,
                    },
                ]}>
                Choose your preferred language for navigation and content.
            </Text>

            <View style={styles.optionsContainer}>
                {LANGUAGE_OPTIONS.map(option => {
                    const selected = language === option.value;

                    return (
                        <Pressable
                            key={option.value}
                            accessibilityRole="radio"
                            accessibilityState={{
                                selected,
                            }}
                            accessibilityLabel={option.label}
                            onPress={() => changeLanguage(option.value)}
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
                                        {option.nativeName}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },

    title: {
        fontSize: 22,
        fontWeight: '800',
    },

    sectionMarginTop: {
        marginTop: 28,
    },

    subtitle: {
        fontSize: 13,
        marginTop: 4,
        marginBottom: 16,
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

