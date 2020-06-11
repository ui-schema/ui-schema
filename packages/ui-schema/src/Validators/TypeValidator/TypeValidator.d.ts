import { validatorPlugin } from '../../Validators/validate'

export type ERROR_WRONG_TYPE = string

export interface validateTypeProps {
    type: string
    value: any
}

export function validateType(props: validateTypeProps): boolean

// tslint:disable-next-line:no-empty-interface
export interface typeValidator extends validatorPlugin {
}
