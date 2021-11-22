/* eslint-disable no-undef */

/*

    TODO: import this file to each test file
    e.g. // someTest.test.js
    import ./customMethods;
*/

expect.extend({
    toBeBooleanOrNull(received) {
        return {
            message: () => `expected ${received} to be boolean or null`,
            pass: received === null || typeof received === 'boolean',
        };
    },

    toBeBoolean(received) {
        return {
            message: () => `expected ${received} to be boolean`,
            pass: typeof received === 'boolean',
        };
    },

    toBeString(received) {
        return {
            message: () => `expected ${received} to be string`,
            pass: typeof received === 'string',
        };
    },

    toBeNumberOrNull(received) {
        return {
            message: () => `expected ${received} to be boolean or null`,
            pass: received === null || typeof received === 'number',
        };
    },

    toBeNumber(received) {
        return {
            message: () => `expected ${received} to be number`,
            pass: typeof received === 'number',
        };
    },

    toBeObject(received) {
        return {
            message: () => `expected ${received} to be object`,
            pass: typeof received === 'object',
        };
    },

    toBeArray(received) {
        return {
            message: () => `expected ${received} to be object`,
            pass: Array.isArray(received),
        };
    },

    notOrBoolean(received) {
        return {
            message: () => `expected ${received} to be boolean or empty`,
            pass: !received || typeof received === 'boolean',
        };
    },

    notOrNumber(received) {
        return {
            message: () => `expected ${received} to be number or empty`,
            pass: !received || typeof received === 'number',
        };
    },
});
