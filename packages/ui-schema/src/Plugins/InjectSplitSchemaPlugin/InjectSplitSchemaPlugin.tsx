import React from 'react'
import { getNextPlugin, PluginProps } from '@ui-schema/ui-schema/PluginStack'
import { useSchemaRoot } from '@ui-schema/ui-schema/SchemaRootProvider'
import { StoreSchemaType } from '@ui-schema/ui-schema'
import { escapePointer } from '@ui-schema/ui-schema/JSONPointer'
import { Map } from 'immutable'

export interface InjectSplitSchemaRootContext {
    schemaStyle?: StoreSchemaType
}

export const InjectSplitSchemaPlugin: React.ComponentType<PluginProps> = (props) => {
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
