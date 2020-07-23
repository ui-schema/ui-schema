import { validatorPlugin } from '../../Validators/validate'

export type ERROR_PATTERN = string

export function validatePattern(type: string, value: any, pattern: string): boolean

// tslint:disable-next-line:no-empty-interface
export interface patternValidator extends validatorPlugin {
}
