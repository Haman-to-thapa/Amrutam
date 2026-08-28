import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function HealthRecordsPlaceholderScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Health Records
            </Text>

            <Text>
                Health Records module is coming next.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
});