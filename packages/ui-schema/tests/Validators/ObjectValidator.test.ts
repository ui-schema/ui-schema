import { List, OrderedMap } from "immutable"
import {
    validateObject, objectValidator, ERROR_ADDITIONAL_PROPERTIES
} from '@ui-schema/ui-schema/Validators/ObjectValidator'
import { createMap, createOrderedMap } from "@ui-schema/ui-schema/Utils"
import { ERROR_PATTERN } from "@ui-schema/ui-schema/Validators/PatternValidator/PatternValidator"

describe('validateObject', () => {
    test.each([
        [
            {type: 'object'},
            {},
            0
        ], [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'string'
                    }
                }
            },
            {name: 'demo'},
            0
        ], [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'number'
                    }
                }
            },
            {name: 'demo'},
            0
        ], [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'number'
                    }
                }
            },
            {name: 'demo', street: 'long-street'},
            1
        ], [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'number'
                    }
                }
            },
            createMap({name: 'demo'}),
            0
        ], [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'number'
                    }
                }
            },
            createMap({name: 'demo', street: 'long-street'}),
            1
        ], [
            {
                type: 'object',
                propertyNames: {
                    pattern: '^((?!user).)*$'
                }
            },
            {name: 'abc'},
            0
        ], [
            {
                type: 'object',
                propertyNames: {
                    pattern: '^((?!user).)*$'
                }
            },
            {name_user: 'abc'},
            1
        ]
    ])('validateObject(%j, %j)', (schema, value, expected) => {
        const r = validateObject(createOrderedMap(schema), value)
        expect(r.size).toBe(expected)
    })
})

describe('objectValidator', () => {
    test.each([
        [OrderedMap({type: 'object'}), true],
        [OrderedMap({type: 'string'}), false],
        [OrderedMap({}), false]
    ])(
        '.should(%j, %s)',
        (schema, expectedValid) => {
            expect(objectValidator.should({schema})).toBe(expectedValid)
        }
    )

    test.each([
        [
            {type: 'object'},
            {},
            List([ERROR_ADDITIONAL_PROPERTIES]),
            true,
            false
        ], [
            {
                type: 'object',
                additionalProperties: false,
                properties: {
                    name: {
                        type: 'number'
                    }
                }
            },
            {name: 'demo'},
            List([ERROR_ADDITIONAL_PROPERTIES]),
            true,
            false
        ], [
            {
                type: 'object',
                additionalProperties: false,
                properties: {
                    name: {
                        type: 'number'
                    }
                }
            },
            {name: 'demo', street: 'long-street'},
            List([ERROR_ADDITIONAL_PROPERTIES]),
            false,
            true
        ], [
            {
                type: 'object',
                propertyNames: {
                    pattern: '^((?!user).)*$'
                }
            },
            {name: 'demo'},
            ERROR_PATTERN,
            true,
            false
        ], [
            {
                type: 'object',
                propertyNames: {
                    pattern: '^((?!user).)*$'
                }
            },
            {name_user: 'demo'},
            ERROR_PATTERN,
            false,
            true
        ],
    ])(
        '.validate(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = objectValidator.validate({
                schema: createOrderedMap(schema),
                value,
                errors: List([]),
                valid: true
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.contains(error)).toBe(expectedError)
        }
    )
})
