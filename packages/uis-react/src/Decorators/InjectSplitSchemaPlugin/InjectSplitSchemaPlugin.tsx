import React from 'react'
import { Map } from 'immutable'
import { useSchemaRoot } from '@ui-schema/react/SchemaRootProvider'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { escapePointer } from '@ui-schema/json-pointer/escapePointer'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { WithValue } from '@ui-schema/react/UIStore'
import { DecoratorPropsNext } from '@ui-schema/react/WidgetDecorator'

export interface InjectSplitSchemaRootContext {
    schemaStyle?: UISchemaMap
}

/**
 * @experimental
 * @param props
 * @constructor
 */
export const InjectSplitSchemaPlugin = <P extends DecoratorPropsNext & WidgetProps & WithValue>(props: P): React.ReactElement<P> => {
    const {
        schema, storeKeys,
    } = props
    const {schemaStyle} = useSchemaRoot<InjectSplitSchemaRootContext>()
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
    const Next = props.next(props.decoIndex + 1)
    return <Next
        {...props}
        decoIndex={props.decoIndex + 1}
        schema={schemaStyleClean ? schema.mergeDeep(schemaStyleClean) : schema}
    />
}
