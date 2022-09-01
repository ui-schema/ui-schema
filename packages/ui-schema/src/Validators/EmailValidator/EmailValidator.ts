import { PluginSimple } from '@ui-schema/ui-schema'

export const ERROR_EMAIL_INVALID = 'email-invalid'

export const emailValidator: PluginSimple = {
    // @ts-ignore
    should: ({schema, value}) => {
        return Boolean(
            schema &&
            typeof value === 'string' &&
            schema.get('format') === 'email'
        )
    },
    // @ts-ignore
    handle: ({value, errors, valid}) => {
        /*
         *  regex from https://emailregex.com/
         */
        if(
            typeof value === 'string' &&
            !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
        ) {
            valid = false
            errors = errors?.addError(ERROR_EMAIL_INVALID)
        }
        return {errors, valid}
    },
}
