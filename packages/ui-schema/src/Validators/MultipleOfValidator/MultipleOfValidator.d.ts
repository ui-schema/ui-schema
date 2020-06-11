import { OrderedMap } from 'immutable'
import { validatorPlugin } from '../../Validators/validate'

export type ERROR_MULTIPLE_OF = string

export interface validateMultipleOfProps {
    type: string
    schema: OrderedMap<{}, undefined>
    value: any
}

export function validateMultipleOf(props: validateMultipleOfProps): boolean

// tslint:disable-next-line:no-empty-interface
export interface multipleOfValidator extends validatorPlugin {
}
