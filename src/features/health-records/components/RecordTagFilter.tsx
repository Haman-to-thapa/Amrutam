import React, { memo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';

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
                    !selectedTag && styles.activeTag,
                ]}>
                <Text
                    style={[
                        styles.text,
                        !selectedTag && styles.activeText,
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
                            active && styles.activeTag,
                        ]}>
                        <Text
                            style={[
                                styles.text,
                                active && styles.activeText,
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
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    activeTag: {
        backgroundColor: '#1f6f43',
        borderColor: '#1f6f43',
    },

    text: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4b5563',
    },

    activeText: {
        color: '#ffffff',
        fontWeight: '700',
    },
});
