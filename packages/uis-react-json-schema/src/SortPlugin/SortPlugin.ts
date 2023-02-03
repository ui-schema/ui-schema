import { OrderedMap, List } from 'immutable'
import { PluginSimple } from '@ui-schema/ui-schema/PluginSimpleStack'

export const SortPlugin: PluginSimple = {
    handle: ({schema}: any) => {
        const sortOrder = schema?.get('sortOrder') as List<string>
        if(!sortOrder) return {}
        const keys = (schema.get('properties') as OrderedMap<string, any>)?.keySeq()
        if(!keys) return {}
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
