import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useAppTheme } from '@/app/providers/ThemeProvider';

const { width } = Dimensions.get('window');

type Props = {
    onFinish: () => void;
};

export function SplashScreen({ onFinish }: Props) {
    const { theme } = useAppTheme();
    const isDark = theme.mode === 'dark';

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const subtitleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Subtitle delay fade in
        Animated.timing(subtitleAnim, {
            toValue: 1,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
        }).start();

        // Pulse ring loop
        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 900,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
            ]),
        );
        pulseLoop.start();

        // Exit transition after 2.2 seconds
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 450,
                useNativeDriver: true,
                easing: Easing.in(Easing.cubic),
            }).start(() => {
                pulseLoop.stop();
                onFinish();
            });
        }, 2200);

        return () => {
            clearTimeout(timer);
            pulseLoop.stop();
        };
    }, [fadeAnim, onFinish, pulseAnim, scaleAnim, subtitleAnim]);

    const bgColor = isDark ? '#0d1f15' : '#f4fbf7';
    const ringBg = isDark ? 'rgba(31, 111, 67, 0.25)' : 'rgba(31, 111, 67, 0.12)';
    const textColor = isDark ? '#ffffff' : '#111827';
    const subtextColor = isDark ? '#9ca3af' : '#4b5563';

    return (
        <Animated.View style={[styles.container, { backgroundColor: bgColor, opacity: fadeAnim }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
            />

            {/* Logo and Emblem */}
            <Animated.View style={[styles.emblemContainer, { transform: [{ scale: scaleAnim }] }]}>
                <Animated.View
                    style={[
                        styles.pulseRing,
                        {
                            backgroundColor: ringBg,
                            borderColor: theme.colors.primary,
                            transform: [{ scale: pulseAnim }],
                        },
                    ]}
                />
                <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.leafIcon}>🌿</Text>
                </View>
            </Animated.View>

            {/* Brand Title */}
            <Animated.View style={[styles.textContainer, { transform: [{ scale: scaleAnim }] }]}>
                <Text style={[styles.brandTitle, { color: textColor }]}>
                    AMRUTAM
                </Text>
                <Text style={[styles.sanskritText, { color: theme.colors.primary }]}>
                    आयुर्वेदः सर्वहिताय
                </Text>
            </Animated.View>

            {/* Tagline */}
            <Animated.View style={[styles.footerContainer, { opacity: subtitleAnim }]}>
                <Text style={[styles.tagline, { color: subtextColor }]}>
                    Authentic Ayurveda • Certified Doctors • Pure Herbs
                </Text>
                <View style={styles.progressBarWrapper}>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.primary }]} />
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emblemContainer: {
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },

    pulseRing: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 1.5,
    },

    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#1f6f43',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
    },

    leafIcon: {
        fontSize: 44,
    },

    textContainer: {
        alignItems: 'center',
    },

    brandTitle: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 6,
    },

    sanskritText: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 6,
        letterSpacing: 2,
    },

    footerContainer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    tagline: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
        marginBottom: 16,
    },

    progressBarWrapper: {
        width: width * 0.45,
        height: 3,
        backgroundColor: 'rgba(156, 163, 175, 0.25)',
        borderRadius: 2,
        overflow: 'hidden',
    },

    progressBar: {
        width: '100%',
        height: '100%',
        borderRadius: 2,
    },
});
