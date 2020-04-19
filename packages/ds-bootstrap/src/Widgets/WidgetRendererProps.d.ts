import React from 'react'
import { OrderedMap } from 'immutable'
import { EditorStore, StoreKeys } from "@ui-schema/ui-schema/Schema/EditorStore"

export type onChangeHandler = (store: EditorStore<any>) => EditorStore<any>
export type onChange = (handler: onChangeHandler) => void

export interface WidgetRendererProps {
    ownKey: string
    schema: OrderedMap<{}, undefined>
    onChange: onChange
    storeKeys: StoreKeys
    showValidity: boolean
    errors: string[]
}

export interface WidgetRendererPropsExtended extends WidgetRendererProps {
    value: boolean
    required: boolean
}
