import { List } from 'immutable'

export const addNestKey = <D>(nestKey: string, keys: List<D>): List<D> =>
    (nestKey ?
        keys.reduce(
            (nk, sk) =>
                nk.concat(sk, List<D>([nestKey as any as D] as D[])),
            List<D>([])
        ) : keys) as List<D>
