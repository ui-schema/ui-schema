import { List } from 'immutable'

export const addNestKey = <D>(nestKey: string, keys: List<D>): List<D> =>
    (nestKey ?
        keys.reduce(
            (nk, sk) =>
                nk.concat(sk, List([nestKey])),
            List([])
        ) : keys) as List<D>
