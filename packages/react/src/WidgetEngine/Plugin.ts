import { WithValidatorErrors } from '@ui-schema/ui-schema/SchemaPlugin'
import type { ComponentType } from 'react'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { onErrorHandler } from '@ui-schema/ui-schema/ValidatorOutput'
import { WithValue } from '@ui-schema/react/UIStore'

/**
 * @todo in WidgetPropsComplete now `WithValue` and `onChange` exists,
 *       adding onChange here would lead to even more generics for actions
 */
export type WidgetPluginProps = WidgetProps & WithValue & WithValidatorErrors & {
    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // is executed in `WidgetRenderer`, not passed down to widget
    onErrors?: onErrorHandler

    // current number of plugin in the stack
    currentPluginIndex: number
}

export type WidgetPluginType = ComponentType<WidgetPluginProps>
