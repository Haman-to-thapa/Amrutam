/* global jest */

jest.mock('react-native-mmkv', () => {
    const storage = new Map();
    return {
        createMMKV: () => ({
            getString: jest.fn(key => storage.get(key)),
            set: jest.fn((key, value) => storage.set(key, value)),
            delete: jest.fn(key => storage.delete(key)),
            remove: jest.fn(key => storage.delete(key)),
            contains: jest.fn(key => storage.has(key)),
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

jest.mock('@react-native-community/netinfo', () => {
    return {
        fetch: jest.fn(() =>
            Promise.resolve({
                isConnected: true,
                isInternetReachable: true,
                type: 'wifi',
                details: {},
            }),
        ),
        addEventListener: jest.fn(() => jest.fn()),
        useNetInfo: jest.fn(() => ({
            isConnected: true,
            isInternetReachable: true,
            type: 'wifi',
            details: {},
        })),
    };
});



