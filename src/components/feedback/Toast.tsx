import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hideToast } from '@/store/slices/toastSlice';
import { useAppTheme } from '@/app/providers/ThemeProvider';

export function Toast() {
    const dispatch = useAppDispatch();
    const { theme } = useAppTheme();
    const toast = useAppSelector(state => state.toast);

    useEffect(() => {
        if (!toast.visible) {
            return;
        }

        const timeout = setTimeout(() => {
            dispatch(hideToast());
        }, 3000);

        return () => clearTimeout(timeout);
    }, [dispatch, toast.visible]);

    if (!toast.visible) {
        return null;
    }

    const toastBg =
        toast.type === 'error'
            ? theme.colors.danger
            : toast.type === 'warning'
                ? theme.colors.warning
                : toast.type === 'success'
                    ? theme.colors.success
                    : theme.colors.primary;

    return (
        <View pointerEvents="box-none" style={styles.container}>
            <Pressable
                accessibilityRole="alert"
                accessibilityLabel={toast.message}
                onPress={() => dispatch(hideToast())}
                style={[
                    styles.toast,
                    {
                        backgroundColor: toastBg,
                    },
                ]}>
                <Text style={styles.message}>{toast.message}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        zIndex: 999,
    },

    toast: {
        minHeight: 48,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },

    message: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});