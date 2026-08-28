import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { selectIsOffline } from '@/store/selectors/networkSelectors';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    visible?: boolean;
    message?: string;
};

function OfflineDataNoticeComponent({
    visible,
    message = 'Showing offline cached data. Some information may be outdated.',
}: Props) {
    const { theme } = useAppTheme();
    const isOffline = useAppSelector(selectIsOffline);

    const showNotice = visible !== undefined ? visible : isOffline;

    if (!showNotice) {
        return null;
    }

    return (
        <View
            accessibilityRole="alert"
            style={[
                styles.container,
                {
                    backgroundColor: theme.mode === 'dark' ? '#2a2215' : '#fef9c3',
                    borderBottomColor: theme.mode === 'dark' ? '#44351b' : '#fef08a',
                },
            ]}>
            <Text style={styles.icon}>📋</Text>
            <Text
                style={[
                    styles.text,
                    {
                        color: theme.mode === 'dark' ? '#fde047' : '#854d0e',
                    },
                ]}>
                {message}
            </Text>
        </View>
    );
}

export const OfflineDataNotice = memo(OfflineDataNoticeComponent);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderBottomWidth: 1,
    },

    icon: {
        fontSize: 12,
        marginRight: 6,
    },

    text: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
});
