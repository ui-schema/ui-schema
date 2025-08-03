import { List } from 'immutable'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'

/**
 *
 * Converts a schema type definition into a distinct string representation.
 * This function is primarily used for generating unique identifiers for widgets
 * based on their schema types, especially when dealing with multiple types
 * (e.g., `['string', 'null']` becoming `'string'`). It handles single types,
 * arrays of types, and Immutable.js Lists of types.
 *
 * Types specified in `noInputTypes` (defaulting to `['null']`) are ignored
 * when determining the distinct type, as they typically don't correspond to
 * a direct user input widget. If multiple non-ignored types are present,
 * they are sorted alphabetically and joined with a `'+'` to form a composite
 * distinct type string (e.g., `['number', 'string']` becomes `'number+string'`).
 *
 * @remarks Use `schemaTypeIsDistinct` for checking distinct types or `schemaTypeIs` for general type checking, instead of getting a type-based ID.
 *
 * @param {unknown | SchemaTypesType} schemaType The schema type(s) to convert. Can be a string, an array of strings, or an Immutable.js List of strings.
 * @param {string[]} [noInputTypes=['null']] An array of types to ignore when determining the distinct type.
 * @returns {string | undefined} A distinct string representation of the schema type, or `undefined` if no valid type can be determined.
 *
 * @example Single type
 * ```js
 * schemaTypeToDistinct('string'); // returns 'string'
 * ```
 *
 * @example Array with a single type
 * ```js
 * schemaTypeToDistinct(['number']); // returns 'number'
 * ```
 *
 * @example Array with multiple types, ignoring 'null'
 * ```js
 * schemaTypeToDistinct(['string', 'null']); // returns 'string'
 * ```
 *
 * @example Array with multiple non-ignored types
 * ```js
 * schemaTypeToDistinct(['number', 'string']); // returns 'number+string'
 * ```
 */
export function schemaTypeToDistinct(
    schemaType: unknown | SchemaTypesType,
    noInputTypes: string[] = ['null'],
): string | undefined {
    let distinctInputType: string | undefined
    if (!schemaType) return distinctInputType

    if (typeof schemaType === 'string') {
        distinctInputType = schemaType
    } else if ((Array.isArray(schemaType) && schemaType.length === 1)) {
        distinctInputType = schemaType[0]
    } else if ((List.isList(schemaType) && schemaType.size === 1)) {
        distinctInputType = (schemaType as List<string>).get(0)!
    } else if (
        (Array.isArray(schemaType) && schemaType.length) ||
        (List.isList(schemaType) && schemaType.size)
    ) {
        const reducedTypes = (schemaType as string[]).reduce<string[]>(
            (c, v) => {
                if (noInputTypes.includes(v)) return c
                c.push(v)
                return c
            },
            [],
        )

        distinctInputType = reducedTypes.sort().join('+')
    }

    return distinctInputType
}
