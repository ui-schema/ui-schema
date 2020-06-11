import { validatorPlugin } from '../../Validators/validate'

export type ERROR_PATTERN = string

export interface validatePatternProps {
    type: string
    pattern: string
    value: any
}

export function validatePattern(props: validatePatternProps): boolean

// tslint:disable-next-line:no-empty-interface
export interface patternValidator extends validatorPlugin {
}
