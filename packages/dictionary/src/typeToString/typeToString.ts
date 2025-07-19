export const typeToString = (
    type:
        // only using `join` of an array, for interop with native Array and immutable List
        { join(separator?: string): string }
        | string
        | undefined,
): string =>
    typeof type === 'string' ? type :
        typeof type !== 'undefined' && 'join' in type ?
            // `type` as `List` or `[]`
            type.join(', ') :
            ''
