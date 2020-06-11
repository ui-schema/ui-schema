import * as React from 'react'
import { StoreKeys, onChange } from "@ui-schema/ui-schema/EditorStore"
import { ownKey, schema, showValidity, valid, required } from '@ui-schema/ui-schema/CommonTypings'

export interface WidgetRendererPropsWithoutErrors {
    ownKey: ownKey
    schema: schema
    onChange: onChange
    storeKeys: StoreKeys
    showValidity: showValidity
    value: boolean
    valid: valid
    required: required
}
export function BoolRenderer<P extends WidgetRendererPropsWithoutErrors>(props: P): React.Component<P>
