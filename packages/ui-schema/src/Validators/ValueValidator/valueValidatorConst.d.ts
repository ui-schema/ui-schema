import { validatorPluginExtended } from '../../Validators/validate'
import { type } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_CONST_MISMATCH = 'const-mismatch'

export function validateConst(type: type, _const?: string | number | boolean, value?: any): boolean

// tslint:disable-next-line:no-empty-interface
export interface valueValidatorConst extends validatorPluginExtended {
}
