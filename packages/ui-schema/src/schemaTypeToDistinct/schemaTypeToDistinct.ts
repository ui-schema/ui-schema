import { List } from 'immutable'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'

export const schemaTypeToDistinct = (
    schemaType: unknown | SchemaTypesType,
    noInputTypes: string[] = ['null'],
): string | undefined => {
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
