import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingState() {
    return (
        <View style={styles.container}>
            <ActivityIndicator />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    text: {
        marginTop: 8,
    },
});