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

type Props = {
    attachment: Attachment;
};

function AttachmentPreviewComponent({ attachment }: Props) {
    const [visible, setVisible] = useState(false);

    if (attachment.type === 'image') {
        return (
            <>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Preview ${attachment.fileName}`}
                    onPress={() => setVisible(true)}
                    style={styles.card}>
                    <Image
                        source={{ uri: attachment.thumbnailUri ?? attachment.uri }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />

                    <Text style={styles.fileName} numberOfLines={1}>
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
                            style={styles.close}>
                            <Text style={styles.closeText}>✕ Close</Text>
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
        <View style={styles.pdfCard}>
            <View style={styles.pdfIconContainer}>
                <Text style={styles.pdfBadge}>📄 PDF</Text>
            </View>

            <Text style={styles.pdfFileName} numberOfLines={2}>
                {attachment.fileName}
            </Text>

            <Text style={styles.pdfHint}>Verified Health Document</Text>
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
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    thumbnail: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },

    fileName: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },

    pdfCard: {
        width: 140,
        minHeight: 120,
        marginRight: 12,
        padding: 12,
        justifyContent: 'space-between',
        borderRadius: 12,
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fee2e2',
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
        color: '#1f2937',
        marginTop: 6,
    },

    pdfHint: {
        marginTop: 4,
        fontSize: 10,
        color: '#991b1b',
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
        backgroundColor: '#ffffff',
    },

    closeText: {
        fontWeight: '700',
        fontSize: 13,
        color: '#111827',
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
