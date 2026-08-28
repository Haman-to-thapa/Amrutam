import React, { memo } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';

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
    const { theme } = useAppTheme();
    const status = getEffectiveSlotStatus(slot);
    const bookable = isSlotBookable(slot);

    return (
        <Pressable
            disabled={!bookable}
            onPress={() => onPress?.(slot)}
            accessibilityRole="button"
            accessibilityLabel={`${formatTime(
                slot.startsAt,
            )}, ${status}`}
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
                ]}>
                {formatTime(slot.startsAt)}
            </Text>

            <Text
                style={[
                    styles.mode,
                    { color: theme.colors.textSecondary },
                ]}>
                {slot.mode}
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
                {status === 'available'
                    ? 'Available'
                    : status === 'booked'
                        ? 'Booked'
                        : status === 'expired'
                            ? 'Expired'
                            : 'Blocked'}
            </Text>
        </Pressable>
    );
}

export const SlotCard = memo(SlotCardComponent);

const styles = StyleSheet.create({
    container: {
        width: '47%',
        marginBottom: 12,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1.5,
    },

    disabled: {
        opacity: 0.5,
    },

    time: {
        fontSize: 16,
        fontWeight: '700',
    },

    mode: {
        marginTop: 4,
        fontSize: 12,
        textTransform: 'capitalize',
    },

    status: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '600',
    },
});