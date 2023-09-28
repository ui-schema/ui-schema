import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export class NoWidgetError extends Error {
    matching?: string

    constructor(message: string, matching?: string) {
        super(message)
        this.matching = matching
    }
}

export function widgetMatcher<P extends { schema?: UISchemaMap }, TLeafs extends {} = {}>(params: P, leafs: TLeafs) {
    const {schema} = params
    const schemaType = schema?.get('type') as SchemaTypesType | undefined
    const schemaWidget = schema?.get('widget')
    let matching: string | undefined
    if (typeof schemaWidget === 'string') {
        matching = schemaWidget
    } else if (typeof schemaType === 'string') {
        matching = 'type:' + schemaType
    }
    if (matching && leafs[matching]) {
        return leafs[matching] as any
    }
    throw new NoWidgetError('No Widget found.', matching)
}
