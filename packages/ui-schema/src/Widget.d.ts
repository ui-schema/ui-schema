import { onChange, StoreKeys } from '@ui-schema/ui-schema/EditorStore'
import { ownKey, showValidity, errors, required, valid, schema } from './CommonTypings'

export interface WidgetProps {
    onChange: onChange
    ownKey: ownKey
    schema: schema
    parentSchema: schema
    level: number
    // the indices of the current widget
    storeKeys: StoreKeys
    // if the widget should show the validity
    showValidity: showValidity
    errors: errors
    required: required
    valid: valid
}

export interface WidgetPropsWithValue extends WidgetProps {
    value: any
}
