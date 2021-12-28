import * as React from 'react'
import { OwnKey, StoreKeys, UIStoreContext, WithScalarValue, WithValue } from '@ui-schema/ui-schema/UIStore'
import { Errors, required, valid, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { UIMetaContext } from '@ui-schema/ui-schema/UIMeta'
import { GroupRendererProps, WidgetsBindingFactory } from '@ui-schema/ui-schema/WidgetsBinding'

// todo: maybe base partly on `AppliedPluginStackProps`?
export type WidgetOverrideType<P extends {} = {}, C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory> =
    React.ComponentType<P & WidgetProps<C, W>> |
    React.ComponentType<P & WidgetProps<C, W> & Pick<WithValue, 'onChange'>> |
    React.ComponentType<P & WidgetProps<C, W> & WithScalarValue>

export type WidgetType<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory> = WidgetOverrideType<{}, C, W>

/**
 * Base widget props which are expected to exist no matter which data "type" the widget is for
 * - for only-scalar widgets add `WithScalarValue`
 * - for any-value-type widgets add `WithValue` and use the HOC `extractValue`
 * - `C` = custom `UIMetaContext` definition
 */
// @ts-ignore
export interface WidgetProps<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory> extends UIMetaContext<C, W> {
    // the current schema level
    schema: StoreSchemaType
    // `parentSchema` must only be `undefined` in the root level of a schema
    parentSchema: StoreSchemaType | undefined

    // the current level in the schema, e.g. `0` for root, `1` for the first properties
    level: number

    // the last index of the current widget
    ownKey: OwnKey
    // all indices of the current widget
    storeKeys: StoreKeys

    // `required` is created inside validator plugin
    required: required
    // todo: extract to validator typings, extend here
    // `errors` and `valid` are created inside validator plugins
    errors?: Errors
    valid?: valid

    // used by grid system
    noGrid?: GroupRendererProps['noGrid']

    // specifying hidden inputs / virtual lists etc.
    isVirtual?: boolean

    // overridable store value:
    showValidity?: UIStoreContext['showValidity']

    // contains the value for non-scalar items, for objects/array it is undefined
    // use typing `WithScalarValue` for those, otherwise for `array`/`object` checkout the HOC: `extractValue` and typing `WithValue`
}
