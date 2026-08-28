import React, { memo, useState } from 'react';
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { Attachment } from '../types/health-record.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    attachment: Attachment;
};

function AttachmentPreviewComponent({ attachment }: Props) {
    const { theme } = useAppTheme();
    const [visible, setVisible] = useState(false);

    if (attachment.type === 'image') {
        return (
            <>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Preview ${attachment.fileName}`}
                    onPress={() => setVisible(true)}
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                        },
                    ]}>
                    <Image
                        source={{ uri: attachment.thumbnailUri ?? attachment.uri }}
                        style={[styles.thumbnail, { backgroundColor: theme.colors.border }]}
                        resizeMode="cover"
                    />

                    <Text style={[styles.fileName, { color: theme.colors.text }]} numberOfLines={1}>
                        🖼️ {attachment.fileName}
                    </Text>
                </Pressable>

                <Modal
                    visible={visible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setVisible(false)}>
                    <View style={styles.modal}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Close attachment preview"
                            onPress={() => setVisible(false)}
                            style={[styles.close, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.closeText, { color: theme.colors.text }]}>✕ Close</Text>
                        </Pressable>

                        <Image
                            source={{ uri: attachment.uri }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.modalFileName}>{attachment.fileName}</Text>
                    </View>
                </Modal>
            </>
        );
    }

    return (
        <View style={[styles.pdfCard, { backgroundColor: theme.mode === 'dark' ? '#3b1818' : '#fef2f2', borderColor: theme.mode === 'dark' ? '#5a2323' : '#fee2e2' }]}>
            <View style={styles.pdfIconContainer}>
                <Text style={styles.pdfBadge}>📄 PDF</Text>
            </View>

            <Text style={[styles.pdfFileName, { color: theme.colors.text }]} numberOfLines={2}>
                {attachment.fileName}
            </Text>

            <Text style={[styles.pdfHint, { color: theme.colors.danger }]}>Verified Health Document</Text>
        </View>
    );
}

export const AttachmentPreview = memo(
    AttachmentPreviewComponent,
);

const styles = StyleSheet.create({
    card: {
        width: 140,
        marginRight: 12,
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
    },

    thumbnail: {
        width: '100%',
        height: 100,
        borderRadius: 8,
    },

    fileName: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '600',
    },

    pdfCard: {
        width: 140,
        minHeight: 120,
        marginRight: 12,
        padding: 12,
        justifyContent: 'space-between',
        borderRadius: 12,
        borderWidth: 1,
    },

    pdfIconContainer: {
        backgroundColor: '#dc2626',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },

    pdfBadge: {
        fontSize: 11,
        fontWeight: '800',
        color: '#ffffff',
    },

    pdfFileName: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 6,
    },

    pdfHint: {
        marginTop: 4,
        fontSize: 10,
        fontWeight: '600',
    },

    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.92)',
    },

    close: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 2,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },

    closeText: {
        fontWeight: '700',
        fontSize: 13,
    },

    fullImage: {
        width: '100%',
        height: '75%',
    },

    modalFileName: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 16,
    },
});

