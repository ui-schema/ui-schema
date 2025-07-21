import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'

interface InputProps {
    minLength?: number
    maxLength?: number
    min?: number | string
    max?: number | string
    step?: number | 'any'
    pattern?: string
    type?: string
}

/**
 * Converts JSON Schema rules into native HTML input attributes.
 *
 * @todo this was written for MUI, in React, thus numbers and not strings, which makes types incompatible
 *
 * @experimental only safe in React environments
 */
export const schemaRulesToNative = (schema: SomeSchema): InputProps => {
    const inputProps: InputProps = {}
    if (typeof schema.get('minLength') === 'number') {
        inputProps['minLength'] = schema.get('minLength')
    }
    if (typeof schema.get('maxLength') === 'number') {
        inputProps['maxLength'] = schema.get('maxLength')
    }

    if (typeof schema.get('minimum') === 'number') {
        if (typeof schema.get('exclusiveMinimum') === 'boolean' && schema.get('exclusiveMinimum')) {
            inputProps['min'] = schema.get('minimum')! + 1
        } else {
            inputProps['min'] = schema.get('minimum')
        }
    } else if (typeof schema.get('exclusiveMinimum') === 'number') {
        inputProps['min'] = schema.get('exclusiveMinimum')! + 1
    }
    if (typeof schema.get('maximum') === 'number') {
        if (typeof schema.get('exclusiveMaximum') === 'boolean' && schema.get('exclusiveMaximum')) {
            inputProps['max'] = String(schema.get('maximum')! - 1)
        } else {
            inputProps['max'] = schema.get('maximum')
        }
    } else if (typeof schema.get('exclusiveMaximum') === 'number') {
        inputProps['max'] = schema.get('exclusiveMaximum')! - 1
    }
    if (typeof schema.get('multipleOf') === 'number') {
        inputProps['step'] = schema.get('multipleOf')
    }
    if (schema.get('pattern')) {
        inputProps['pattern'] = schema.get('pattern')
    }

    // todo: add this here or via an extra type `schemaToInputType`?
    //       some would be fallbacks if no type keyword exists, others as fallback,
    //       which also depends on current value, to support multi-type string/number
    // if (schema.get('format') === 'date-time' || schema.get('format') === 'date' || schema.get('format') === 'time') {
    //     inputProps['type'] = schema.get('format')
    // }
    // if (schema.get('format') === 'email') {
    //     inputProps['type'] = 'email'
    // }
    // if (schema.get('format') === 'uri') {
    //     inputProps['type'] = 'url'
    // }
    // if (schema.get('format') === 'uri-reference' || schema.get('format') === 'uri-template') {
    //     inputProps['type'] = 'url'
    // }
    // if (schema.get('format') === 'byte' || schema.get('format') === 'binary') {
    //     inputProps['type'] = 'file'
    // }
    // if (schema.get('format') === 'int32' || schema.get('format') === 'int64') {
    //     inputProps['type'] = 'number'
    // }
    // if (schema.get('format') === 'float' || schema.get('format') === 'double') {
    //     inputProps['type'] = 'number'
    // }
    // if (schema.get('format') === 'password') {
    //     inputProps['type'] = 'password'
    // }

    return inputProps
}
