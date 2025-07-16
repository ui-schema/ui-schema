import { ValidatorOutput } from '@ui-schema/ui-schema/ValidatorOutput'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'

const validator = Validator(standardValidators)
const validate = validator.validate

export const newMockStateNested = () => ({
    validate: validate,
})

export const newMockState = () => ({
    output: new ValidatorOutput(),
    validate: validate,
    context: {},
})
