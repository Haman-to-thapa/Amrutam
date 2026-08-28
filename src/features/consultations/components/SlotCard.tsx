import React, { memo } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { formatTime } from '@/core/utils/date';

import {
    getEffectiveSlotStatus,
    isSlotBookable,
} from '../utils/slotUtils';

import type { DoctorSlot } from '../types/consultation.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    slot: DoctorSlot;
    onPress?: (slot: DoctorSlot) => void;
};

function SlotCardComponent({ slot, onPress }: Props) {
    const { t } = useTranslation();
    const { theme } = useAppTheme();
    const status = getEffectiveSlotStatus(slot);
    const bookable = isSlotBookable(slot);

    const modeText = t(`modes.${slot.mode}` as const, { defaultValue: slot.mode });
    const statusText = t(`slotStatus.${status}` as const, {
        defaultValue: status === 'available'
            ? 'Available'
            : status === 'booked'
                ? 'Booked'
                : status === 'expired'
                    ? 'Expired'
                    : 'Blocked',
    });

    return (
        <Pressable
            disabled={!bookable}
            onPress={() => onPress?.(slot)}
            accessibilityRole="button"
            accessibilityLabel={`${formatTime(slot.startsAt)}, ${statusText}`}
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: bookable
                        ? theme.colors.primary
                        : theme.colors.border,
                },
                !bookable && styles.disabled,
            ]}>
            <Text
                style={[
                    styles.time,
                    { color: theme.colors.text },
                ]}
                numberOfLines={1}>
                {formatTime(slot.startsAt)}
            </Text>

            <Text
                style={[
                    styles.mode,
                    { color: theme.colors.textSecondary },
                ]}>
                {modeText}
            </Text>

            <Text
                style={[
                    styles.status,
                    {
                        color: bookable
                            ? theme.colors.primary
                            : theme.colors.disabled,
                    },
                ]}>
                {statusText}
            </Text>
        </Pressable>
    );
}

export const SlotCard = memo(SlotCardComponent);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 6,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        minHeight: 90,
        justifyContent: 'center',
    },

    disabled: {
        opacity: 0.45,
    },

    time: {
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: -0.3,
    },

    mode: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '500',
    },

    status: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '700',
    },
});
