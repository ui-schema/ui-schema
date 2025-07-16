import { toPointer } from '@ui-schema/json-pointer/toPointer'

export const ERROR_EMAIL_INVALID = 'email-invalid'

export const validateEmail = (value) => {
    /*
     *  regex from https://emailregex.com/
     */
    if (
        typeof value === 'string' &&
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
    ) {
        return false
    }
    return true
}

export const emailValidator = {
    id: 'format:email',
    // `format: "email"` validator
    types: ['string' as const],
    validate: (schema, value, params) => {
        if (schema.get('format') !== 'email') return
        if (!validateEmail(value)) {
            params.output.addError({
                error: ERROR_EMAIL_INVALID,
                keywordLocation: toPointer([...params.keywordLocation, 'format']),
                instanceLocation: toPointer(params.instanceLocation),
            })
        }
    },
}
