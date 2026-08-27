import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hideToast } from '@/store/slices/toastSlice';

export function Toast() {
    const dispatch = useAppDispatch();

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

    return (
        <View pointerEvents="box-none" style={styles.container}>
            <Pressable
                accessibilityRole="alert"
                accessibilityLabel={toast.message}
                onPress={() => dispatch(hideToast())}
                style={[styles.toast, styles[toast.type]]}>
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
    },

    success: {
        backgroundColor: '#1f7a4d',
    },

    info: {
        backgroundColor: '#2563eb',
    },

    warning: {
        backgroundColor: '#b45309',
    },

    error: {
        backgroundColor: '#b91c1c',
    },

    message: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});