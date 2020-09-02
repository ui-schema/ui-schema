import * as React from 'react'
import { StoreKeys, onChange, ownKey } from "@ui-schema/ui-schema/EditorStore"
import { StoreSchemaType, showValidity, valid, required } from '@ui-schema/ui-schema/CommonTypings'

export interface WidgetRendererPropsWithoutErrors {
    ownKey: ownKey
    schema: StoreSchemaType
    onChange: onChange
    storeKeys: StoreKeys
    showValidity: showValidity
    value: boolean
    valid: valid
    required: required
}
export function BoolRenderer<P extends WidgetRendererPropsWithoutErrors>(props: P): React.ReactElement<P>
