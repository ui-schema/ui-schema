import * as React from 'react'
import { Map } from 'immutable'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { useSchemaRoot } from '@ui-schema/react/SchemaRootProvider'
import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { escapePointer } from '@ui-schema/json-pointer/escapePointer'

export interface InjectSplitSchemaRootContext {
    schemaStyle?: SomeSchema
}

/**
 * @deprecated use a custom schemaPlugin instead
 */
export const InjectSplitSchemaPlugin: React.ComponentType<WidgetPluginProps> = (props) => {
    const {
        schema, storeKeys,
        Next,
    } = props
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const {schemaStyle} = useSchemaRoot<InjectSplitSchemaRootContext>()
    const pointer = storeKeys.size > 0 ? '/' + storeKeys.map(k => escapePointer(String(k))).join('/') : ''

    const schemaStyleLevel = schemaStyle?.get(pointer) as Map<string, any> | undefined
    let schemaStyleClean: SomeSchema | undefined
    if (schemaStyleLevel && Map.isMap(schemaStyleLevel)) {
        schemaStyleClean = schemaStyleLevel
            .delete('properties')
            .delete('items')
            .delete('if')
            .delete('else')
            .delete('then')
            .delete('not')
            .delete('allOf')
            .delete('anyOf')
            .delete('required')
    }

    return <Next.Component
        {...props}
        schema={schemaStyleClean ? schema.mergeDeep(schemaStyleClean) : schema}
    />
}
