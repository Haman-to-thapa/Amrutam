import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    title: string;
    message: string;
};

export function EmptyState({ title, message }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
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
});