import { onChange, StoreKeys } from '@ui-schema/ui-schema/EditorStore'
import { ownKey, showValidity, errors, required, valid, schema } from './CommonTypings'

export interface WidgetProps {
    ownKey: ownKey
    schema: schema
    onChange: onChange
    storeKeys: StoreKeys
    showValidity: showValidity
    errors: errors
}

export interface WidgetPropsExtended extends WidgetProps {
    value: any
    required: required
}

export interface WidgetExtendedCheckValid extends WidgetPropsExtended {
    valid: valid
}
