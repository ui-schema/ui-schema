import { onChange, OwnKey, StoreKeys } from '@ui-schema/ui-schema/UIStore'
import { showValidity, Errors, required, valid, StoreSchemaType } from './CommonTypings'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'

export interface WidgetProps {
    onChange: onChange
    schema: StoreSchemaType
    parentSchema: StoreSchemaType
    // the current level in the schema, e.g. `0` for root, `1` for the first properties
    level: number
    // the last index of the current widget
    ownKey: OwnKey
    // all indices of the current widget
    storeKeys: StoreKeys
    // if the widget should show the validity
    showValidity: showValidity
    errors: Errors
    required: required
    valid: valid
    widgets: WidgetsBindingBase
    // contains the value for non-scalar items, for objects/array it is undefined
    value: string | number | boolean | undefined | null
}
