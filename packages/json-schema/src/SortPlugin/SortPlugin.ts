import { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { OrderedMap, List } from 'immutable'
import { SchemaPlugin, SchemaPluginProps } from '@ui-schema/ui-schema/SchemaPlugin'

export const SortPlugin: SchemaPlugin<{ schema: SomeSchema } & SchemaPluginProps> = {
    handle: ({schema}: any) => {
        const sortOrder = schema?.get('sortOrder') as List<string>
        if (!sortOrder) return {}
        const keys = (schema.get('properties') as OrderedMap<string, any>)?.keySeq()
        if (!keys) return {}
        const nonSortedProps = keys.filter(k => !sortOrder.includes(k))
        return {
            schema: schema.set(
                'properties',
                sortOrder.filter((key) => keys.includes(key))
                    .concat(nonSortedProps)
                    .reduce(
                        (properties, key: string) =>
                            properties.set(key, schema.getIn(['properties', key])),
                        OrderedMap() as OrderedMap<string, any>,
                    ),
            ),
        }
    },
}
