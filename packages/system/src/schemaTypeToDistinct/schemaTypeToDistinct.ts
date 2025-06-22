import { List } from 'immutable'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'

export const schemaTypeToDistinct = (schemaType: unknown | SchemaTypesType, noInputTypes: string[] = ['null']): string | undefined => {
    let distinctInputType: string | undefined
    if (!schemaType) return distinctInputType

    if (typeof schemaType === 'string') {
        distinctInputType = schemaType
    } else if ((Array.isArray(schemaType) && schemaType.length === 1) || (List.isList(schemaType) && schemaType.size === 1)) {
        distinctInputType = schemaType.join()
    } else if (Array.isArray(schemaType) || List.isList(schemaType)) {
        const reducedTypes = (schemaType as string[]).reduce(
            (c, v) => (noInputTypes.includes(v) ? c : c.push(v)) as List<string>,
            List(),
        )
        if (reducedTypes.size === 1) {
            distinctInputType = reducedTypes.join()
        }
    }
    return distinctInputType
}
