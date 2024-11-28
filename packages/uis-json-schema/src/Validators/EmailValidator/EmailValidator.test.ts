import { test, expect, describe } from '@jest/globals'
import { validateEmail } from '@ui-schema/json-schema/Validators/EmailValidator'

describe('validateEmail', () => {
    test.each([
        [
            'demo@example.org', true,
        ],
        [
            'demo@example.org.de.tld', true,
        ],
        [
            'demo.some@example.org.de.tld', true,
        ],
        [
            'demo.some292@example.org.de.tld', true,
        ],
        [
            '92demo.some_234-23@example.org', true,
        ],
        [
            // actually a correct email, but not "valid" for typical web usages
            '92demo.some_234-23@example.o', false,
        ],
        [
            // actually a correct email, but not "valid" for typical web usages
            'demo@example', false,
        ],
        [
            'demo.de@example', false,
        ],
        [
            'demo@example,org', false,
        ],
        [
            'demo,dee@example.org', false,
        ],
        [
            'demo@,dee@example.org', false,
        ],
        [
            'demo@dee@example.org', false,
        ],
        [
            'demo..dee@example.org', false,
        ],
        [
            // according to RFC correct, but not supported by most/normal email providers
            'demo(dee@example.org', false,
        ],
        [
            // according to RFC correct, but not supported by most/normal email providers
            'demo)dee@example.org', false,
        ],
    ])('validateEmail(%s): %j', (email, isValid) => {
        expect(validateEmail(email)).toBe(isValid)
    })
})
