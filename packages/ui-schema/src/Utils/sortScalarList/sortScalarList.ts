import { List } from 'immutable'

export const sortScalarList = <L extends List<string | number | any> = List<string | number | any>>(list: L): L =>
    list.sort(
        (a, b = '') =>
            typeof a === 'string' ? a.localeCompare(b) :
                typeof a === 'number' ? a > b ? 1 : a < b ? -1 : 0 : 1,
    ) as L
