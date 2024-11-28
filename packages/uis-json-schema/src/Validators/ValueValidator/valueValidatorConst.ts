import { isEqual } from '@ui-schema/system/Utils/isEqual'
import { fromJS, isImmutable, List, Map, Record } from 'immutable'

export const ERROR_CONST_MISMATCH = 'const-mismatch'

export const validateConst = (_const?: object | string | number | boolean | null, value?: any): boolean => {
    if (typeof _const === 'undefined' || typeof value === 'undefined') return true
    let tValue = value
    if (Array.isArray(value)) {
        tValue = List(fromJS(value))
    } else if (
        typeof value === 'object' && value !== null
        && !isImmutable(value)
        && !Record.isRecord(value)
    ) {
        tValue = Map(fromJS(value))
    }

    if (
        typeof _const === 'object' && _const
        && !isImmutable(_const)
        && !Record.isRecord(_const)
    ) {
        _const = fromJS(_const)
    }

    return isEqual(tValue, _const)
}
