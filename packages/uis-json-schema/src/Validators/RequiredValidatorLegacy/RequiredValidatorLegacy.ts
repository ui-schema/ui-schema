import { ValidatorHandler } from '@ui-schema/json-schema/Validator'
import { ERROR_NOT_SET } from '@ui-schema/json-schema/Validators'
import { List } from 'immutable'

/**
 * `required` validator - compatibility/legacy "HTML-like required"
 */
export const requiredValidatorLegacy: ValidatorHandler = {
    id: 'required',
    validate: (_schema, value, params, state) => {
        const requiredList = params.parentSchema?.get('required') as List<string> | undefined
        if (!requiredList || typeof params.instanceKey !== 'string') return
        const ownKey = params.instanceKey
        if (!requiredList.includes(ownKey)) return
        if (
            typeof value === 'undefined'
            // todo: make HTML-like-required configurable; add `id` to validators to allow easy overwriting of existing?
            || value === ''
            || value === false
        ) {
            state.output.addError(ERROR_NOT_SET)
        }
    },
}
