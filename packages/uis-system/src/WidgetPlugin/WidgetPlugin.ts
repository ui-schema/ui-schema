import { WidgetPayload } from '@ui-schema/system/Widget'

export interface WidgetPluginPayload extends WidgetPayload {
    // current number of plugin in the stack
    currentPluginIndex: number
}
