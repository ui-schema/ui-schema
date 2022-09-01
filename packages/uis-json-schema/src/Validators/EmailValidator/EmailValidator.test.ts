import { emailValidator } from '@ui-schema/json-schema/Validators/EmailValidator/EmailValidator'
import { OrderedMap } from 'immutable'

describe('emailValidator', () => {
    test.each([
        [
            'demo@example.org', true,
        ], [
            'demo@example.org.de.tld', true,
        ], [
            'demo.some@example.org.de.tld', true,
        ], [
            'demo.some292@example.org.de.tld', true,
        ], [
            '92demo.some_234-23@example.org', true,
        ], [
            // actually a correct email, but not "valid" for typical web usages
            '92demo.some_234-23@example.o', false,
        ], [
            // actually a correct email, but not "valid" for typical web usages
            'demo@example', false,
        ], [
            'demo.de@example', false,
        ], [
            'demo@example,org', false,
        ], [
            'demo,dee@example.org', false,
        ], [
            'demo@,dee@example.org', false,
        ], [
            'demo@dee@example.org', false,
        ], [
            'demo..dee@example.org', false,
        ], [
            // according to RFC correct, but not supported by most/normal email providers
            'demo(dee@example.org', false,
        ], [
            // according to RFC correct, but not supported by most/normal email providers
            'demo)dee@example.org', false,
        ],
    ])('emailValidator.handle(%s): %j', (email, isValid) => {
        // @ts-ignore
        const r = emailValidator.handle({value: email, valid: true})
        expect(r.valid).toBe(isValid)
    })
    test.each([
        [
            OrderedMap({
                type: 'string',
                format: 'email',
            }),
            '',
            true,
        ], [
            OrderedMap({
                type: 'string',
                format: 'email',
            }),
            'some-text',
            true,
        ], [
            OrderedMap({
                type: 'string',
                format: 'email',
            }),
            undefined,
            false,
        ], [
            OrderedMap({
                type: 'string',
                format: 'email',
            }),
            0,
            false,
        ], [
            OrderedMap({
                type: 'integer',
                format: 'email',
            }),
            'some-text',
            true,
        ], [
            OrderedMap({
                type: 'string',
                format: 'emails',
            }),
            'some-text',
            false,
        ], [
            OrderedMap({
                type: ['string'],
                format: 'email',
            }),
            'some-text',
            true,
        ], [
            OrderedMap({
                type: ['string', 'integer'],
                format: 'email',
            }),
            'some-text',
            true,
        ], [
            OrderedMap({
                type: ['string', 'integer'],
                format: 'email',
            }),
            10,
            false,
        ],
    ])('emailValidator.should(%s): %j', (schema, email, expected: boolean) => {
        // @ts-ignore
        expect(emailValidator.should({schema, value: email})).toBe(expected)
    })
})
