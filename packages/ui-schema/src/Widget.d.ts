import { onChange, ownKey, StoreKeys } from '@ui-schema/ui-schema/EditorStore'
import { showValidity, errors, required, valid, StoreSchemaType } from './CommonTypings'
import { widgetsBase } from "@ui-schema/ui-schema/widgetsBase"

export interface WidgetProps {
    onChange: onChange
    schema: StoreSchemaType
    parentSchema: StoreSchemaType
    level: number
    // the last index of the current widget
    ownKey: ownKey
    // all indices of the current widget
    storeKeys: StoreKeys
    // if the widget should show the validity
    showValidity: showValidity
    errors: errors
    required: required
    valid: valid
    widgets: widgetsBase
    // contains the value for non-scalar items, for objects/array it is undefined
    value: string | number | boolean | undefined | null
}
