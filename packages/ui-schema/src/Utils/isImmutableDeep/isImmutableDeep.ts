import { List, Map, Record, Seq } from 'immutable'

export function isImmutableDeep(maybeImmutable: any, curr: boolean = true): boolean {
    if (typeof maybeImmutable !== 'object' || maybeImmutable === null) {
        if (typeof maybeImmutable !== 'string' && typeof maybeImmutable !== 'boolean' && typeof maybeImmutable !== 'number') {
            if (process.env.NODE_ENV === 'development') {
                console.warn('is immutable, non convertible found', maybeImmutable)
            }
            curr = false
        }
    } else {
        if (List.isList(maybeImmutable)) {
            Seq(maybeImmutable).forEach(e => curr = isImmutableDeep(e, curr))
        } else if (Map.isMap(maybeImmutable)) {
            Seq(maybeImmutable).forEach(e => curr = isImmutableDeep(e, curr))
        } else if (Record.isRecord(maybeImmutable)) {
            Seq(maybeImmutable).forEach(e => curr = isImmutableDeep(e, curr))
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.warn('is immutable, not converted found', maybeImmutable)
            }
            curr = false
        }
    }
    return curr
}
