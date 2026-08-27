import React, { memo } from 'react';
import {
    StyleSheet,
    TextInput,
    type TextInputProps,
} from 'react-native';

type Props = TextInputProps;

function InputComponent(props: Props) {
    return (
        <TextInput
            {...props}
            placeholderTextColor="#777"
            style={[styles.input, props.style]}
        />
    );
}

export const Input = memo(InputComponent);

const styles = StyleSheet.create({
    input: {
        minHeight: 48,
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        color: '#111827',
        fontSize: 15,
    },
});