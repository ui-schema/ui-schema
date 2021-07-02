import { OwnKey, StoreKeys, UIStoreContext, WithScalarValue, WithValue } from '@ui-schema/ui-schema/UIStore'
import { Errors, required, valid, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { UIMetaContext } from '@ui-schema/ui-schema/UIMeta'
import { GroupRendererProps } from '@ui-schema/ui-schema/WidgetsBinding'
import * as React from 'react'

// todo: maybe base partly on `AppliedPluginStackProps`?
export type WidgetOverrideType<P extends {} = {}, C extends {} = {}> =
    React.ComponentType<P & WidgetProps<C>> |
    React.ComponentType<P & WidgetProps<C> & Pick<WithValue, 'onChange'>> |
    React.ComponentType<P & WidgetProps<C> & WithScalarValue>

export type WidgetType<C extends {} = {}> = WidgetOverrideType<{}, C>

export interface WidgetProps<C extends {} = {}> extends UIMetaContext<C> {
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
