export class MockTimeoutError extends Error {
    constructor() {
        super('MOCK_TIMEOUT');

        this.name = 'MockTimeoutError';
    }
}

export class MockSessionExpiredError extends Error {
    constructor() {
        super('MOCK_SESSION_EXPIRED');

        this.name = 'MockSessionExpiredError';
    }
}

export class MockInvalidJsonError extends Error {
    constructor() {
        super('MOCK_INVALID_JSON');

        this.name = 'MockInvalidJsonError';
    }
}

export class MockRandomFailureError extends Error {
    constructor() {
        super('MOCK_RANDOM_FAILURE');

        this.name = 'MockRandomFailureError';
    }
}