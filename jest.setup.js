/* global jest */

jest.mock('react-native-mmkv', () => {
    const storage = new Map();
    return {
        createMMKV: () => ({
            getString: jest.fn(key => storage.get(key)),
            set: jest.fn((key, value) => storage.set(key, value)),
            delete: jest.fn(key => storage.delete(key)),
            clearAll: jest.fn(() => storage.clear()),
        }),
    };
});

jest.mock('@shopify/flash-list', () => {
    const React = require('react');
    const { FlatList } = require('react-native');
    return {
        FlashList: React.forwardRef((props, ref) =>
            React.createElement(FlatList, { ...props, ref }),
        ),
    };
});


