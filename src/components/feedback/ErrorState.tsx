import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    message: string;
    onRetry: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Unable to load</Text>

            <Text style={styles.message}>{message}</Text>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Retry"
                onPress={onRetry}
                style={styles.button}>
                <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    message: {
        marginTop: 8,
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#1f6f43',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
});