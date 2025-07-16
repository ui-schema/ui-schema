/**
 * Transforms `enum` values to translatable values, currently doesn't do much, used mostly where `ttEnum` is used.
 *
 * Transformations:
 *
 * - `boolean` to `yes`/`no`
 * - `null` to `null`
 */
export const getTranslatableEnum = (value: string | number | boolean | null) => {
    return typeof value === 'boolean' ? value ? 'yes' : 'no' :
        value === null ? 'null' : value
}
