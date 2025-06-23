import React from 'react'
import { Map } from 'immutable'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { useSchemaRoot } from '@ui-schema/react-json-schema/SchemaRootProvider'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { escapePointer } from '@ui-schema/json-pointer/escapePointer'

export interface InjectSplitSchemaRootContext {
    schemaStyle?: UISchemaMap
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
    let schemaStyleClean: UISchemaMap | undefined
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
