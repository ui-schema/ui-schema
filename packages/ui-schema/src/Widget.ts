import * as React from 'react'
import { OwnKey, StoreKeys, UIStoreContext, WithOnChange, WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { Errors, required, valid, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { UIMetaContext } from '@ui-schema/ui-schema/UIMeta'
import { GroupRendererProps, WidgetsBindingFactory } from '@ui-schema/ui-schema/WidgetsBinding'
import { UIStoreActions } from '@ui-schema/ui-schema/UIStoreActions'

// todo: maybe base partly on `AppliedPluginStackProps`?
export type WidgetOverrideType<C extends {} = {}, P extends {} = {}, W = WidgetsBindingFactory, A = UIStoreActions> =
    React.ComponentType<P & WidgetProps<W> & C> |
    React.ComponentType<P & WidgetProps<W> & C & WithOnChange<A>> |
    React.ComponentType<P & WidgetProps<W> & C & WithScalarValue>

export type WidgetType<C extends {} = {}, W = WidgetsBindingFactory> = WidgetOverrideType<C, {}, W>

/**
 * Base widget props which are expected to exist no matter which data "type" the widget is for
 * - for only-scalar widgets add `WithScalarValue`
 * - for any-value-type widgets add `WithValue` and use the HOC `extractValue`
 * - `C` = custom `UIMetaContext` definition
 */
export interface WidgetProps<W = WidgetsBindingFactory> extends UIMetaContext<W> {
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
