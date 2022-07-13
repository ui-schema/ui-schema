import React from 'react'
import { Map } from 'immutable'
import { getNextPlugin, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { useSchemaRoot } from '@ui-schema/react-json-schema/SchemaRootProvider'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { escapePointer } from '@ui-schema/json-pointer/escapePointer'

export interface InjectSplitSchemaRootContext {
    schemaStyle?: UISchemaMap
}

/**
 * @experimental
 * @param props
 * @constructor
 */
export const InjectSplitSchemaPlugin: React.ComponentType<WidgetPluginProps> = (props) => {
    const {
        schema, storeKeys,
        currentPluginIndex,
    } = props
    const {schemaStyle} = useSchemaRoot<InjectSplitSchemaRootContext>()
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, props.widgets)
    const pointer = storeKeys.size > 0 ? '/' + storeKeys.map(k => escapePointer(String(k))).join('/') : ''

    const schemaStyleLevel = schemaStyle?.get(pointer) as Map<string, any> | undefined
    let schemaStyleClean
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
    // @ts-ignore
    return <Plugin
        {...props}
        currentPluginIndex={next}
        schema={schemaStyleClean ? schema.mergeDeep(schemaStyleClean) : schema}
    />
}
