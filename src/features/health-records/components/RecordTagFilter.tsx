import React, { memo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';
import { useAppTheme } from '@/app/providers/ThemeProvider';

const TAGS = [
    'wellness',
    'ayurveda',
    'blood-test',
    'follow-up',
    'preventive',
    'general',
    'cardiology',
    'immunity',
];

type Props = {
    selectedTag?: string;
    onChange: (tag?: string) => void;
};

function RecordTagFilterComponent({
    selectedTag,
    onChange,
}: Props) {
    const { theme } = useAppTheme();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="All tags"
                onPress={() => onChange(undefined)}
                style={[
                    styles.tag,
                    {
                        backgroundColor: !selectedTag
                            ? theme.colors.primary
                            : theme.colors.surface,
                        borderColor: !selectedTag
                            ? theme.colors.primary
                            : theme.colors.border,
                    },
                ]}>
                <Text
                    style={[
                        styles.text,
                        {
                            color: !selectedTag
                                ? '#FFFFFF'
                                : theme.colors.text,
                        },
                    ]}>
                    # All Tags
                </Text>
            </Pressable>

            {TAGS.map(tag => {
                const active = selectedTag === tag;

                return (
                    <Pressable
                        key={tag}
                        accessibilityRole="button"
                        accessibilityLabel={`Filter by ${tag}`}
                        onPress={() => onChange(tag)}
                        style={[
                            styles.tag,
                            {
                                backgroundColor: active
                                    ? theme.colors.primary
                                    : theme.colors.surface,
                                borderColor: active
                                    ? theme.colors.primary
                                    : theme.colors.border,
                            },
                        ]}>
                        <Text
                            style={[
                                styles.text,
                                {
                                    color: active
                                        ? '#FFFFFF'
                                        : theme.colors.text,
                                },
                            ]}>
                            #{tag}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

export const RecordTagFilter = memo(
    RecordTagFilterComponent,
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 10,
        gap: 8,
    },

    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },

    text: {
        fontSize: 12,
        fontWeight: '700',
    },
});

