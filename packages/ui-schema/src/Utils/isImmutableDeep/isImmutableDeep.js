import {List, Map, Seq} from 'immutable';

export function isImmutableDeep(maybeImmutable, curr = true) {
    if(typeof maybeImmutable !== 'object' || maybeImmutable === null) {
        if(typeof maybeImmutable !== 'string' && typeof maybeImmutable !== 'boolean' && typeof maybeImmutable !== 'number') {
            console.warn('not convertable found', maybeImmutable)
            curr = false
        }
    } else {
        if(List.isList(maybeImmutable)) {
            Seq(maybeImmutable).forEach(e => curr = isImmutableDeep(e, curr))
        } else if(Map.isMap(maybeImmutable)) {
            Seq(maybeImmutable).forEach(e => curr = isImmutableDeep(e, curr))
        } else {
            console.warn('not converted found', maybeImmutable)
            curr = false
        }
    }
    return curr
}
