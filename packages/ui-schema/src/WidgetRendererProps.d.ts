import { OrderedMap } from 'immutable'
import { EditorStore, StoreKeys } from "@ui-schema/ui-schema/EditorStore"

export type onChangeHandler = (store: EditorStore<any>) => EditorStore<any>
export type onChange = (handler: onChangeHandler) => void

export type rows = (schema: OrderedMap<{}, undefined>) => number

export type rowsMax = (schema: OrderedMap<{}, undefined>) => number

export interface WidgetRendererProps {
    ownKey: string
    schema: OrderedMap<{}, undefined>
    onChange: onChange
    storeKeys: StoreKeys
    showValidity: boolean
    errors: string[]
}


export interface WidgetRendererPropsExtended extends WidgetRendererProps {
    value: any
    required: boolean
}

export interface WidgetRendererPropsExtendedCheckValid extends WidgetRendererPropsExtended {
    valid: boolean
}

