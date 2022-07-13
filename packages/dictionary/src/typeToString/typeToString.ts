// todo: this also supports `List<string>`, like used in the `/react` package
export const typeToString = (type: string[] | string | undefined): string =>
    typeof type === 'string' ? type :
        typeof type !== 'undefined' && 'join' in type ?
            // `type` as `List` or `[]`
            type.join(', ') :
            ''
