import * as React from 'react'
import { onChange } from '../../../../ui-schema/src/WidgetRendererProps'
import { OrderedMap } from 'immutable'
import { StoreKeys } from "'../../../../ui-schema/src/EditorStore/EditorStore"

export interface WidgetRendererPropsWithoutErrors {
    ownKey: string
    schema: OrderedMap<{}, undefined>
    onChange: onChange
    storeKeys: StoreKeys
    showValidity: boolean
    value: any
    valid: boolean
    required: boolean
}
export function BoolRenderer<P extends WidgetRendererPropsWithoutErrors>(props: P): React.Component<P>
