import { PluginSimple } from '@ui-schema/ui-schema'

export const ERROR_EMAIL_INVALID = 'email-invalid'

export const emailValidator: PluginSimple = {
    should: ({schema}) => {
        return Boolean(schema && schema.get('type') === 'string' && schema.get('format') === 'email')
    },
    // @ts-ignore
    handle: ({value, errors, valid}) => {
        /*
         *  regex from https://emailregex.com/
         */
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
            valid = false
            errors = errors?.addError(ERROR_EMAIL_INVALID)
        }
        return {errors, valid}
    },
}
