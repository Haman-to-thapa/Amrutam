import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    children: ReactNode;
};

type State = {
    hasError: boolean;
    error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
        error: null,
    };

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Logger will be connected in Step 12.
        if (__DEV__) {
            console.error('ErrorBoundary:', error);
            console.error('ErrorInfo:', errorInfo);
        }
    }

    private handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong</Text>

                    <Text style={styles.message}>
                        The app encountered an unexpected problem.
                    </Text>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Try again"
                        onPress={this.handleRetry}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Try Again</Text>
                    </Pressable>

                    {__DEV__ && this.state.error ? (
                        <Text style={styles.debugText}>
                            {this.state.error.message}
                        </Text>
                    ) : null}
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
    },
    message: {
        marginTop: 8,
        textAlign: 'center',
    },
    button: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#1f6f43',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    debugText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 12,
    },
});