import React from 'react'
import { WithOnChange, WithScalarValue } from '@ui-schema/react/UIStore'
import { UIMetaContext } from '@ui-schema/react/UIMeta'
import { GroupRendererProps } from '@ui-schema/react/Widgets'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { WidgetPayload } from '@ui-schema/system/Widget'

// todo: maybe base partly on `AppliedWidgetEngineProps`?
export type WidgetOverrideType<C extends {} = {}, P extends {} = {}, A = UIStoreActions> =
    React.ComponentType<P & WidgetProps & C> |
    React.ComponentType<P & WidgetProps & C & WithOnChange<A>> |
    React.ComponentType<P & WidgetProps & C & WithScalarValue<A>>

export type WidgetType<C extends {} = {}, A = UIStoreActions> = WidgetOverrideType<C, {}, A>

// todo: maybe add `value` in a way that typing `const v = invalid ? undefined : value`, the `v` will be strongly typed against the "data-mapping type"

/**
 * WIP: The fundamental contract which UIS-React expect for the WidgetEngine,
 * all else will be moved to own typings, with the goal to reuse `ReactDeco` at the end for inference.
 *
 * This was previously:
 * Base widget props which are expected to exist no matter which data "type" the widget is for
 * - for only-scalar widgets add `WithScalarValue`
 * - for any-value-type widgets add `WithValue` and use the HOC `extractValue`
 * - `C` = custom `UIMetaContext` definition
 */
export interface WidgetProps extends UIMetaContext, WidgetPayload {
    // used by grid system
    // todo: move to "ReactWidgetStack of DS" / remove from standard / move from "WidgetProps" to the successor of "WidgetEngine", somehow coupled to the sucessor of "WidgetRenderer"
    noGrid?: GroupRendererProps['noGrid']

    // specifying hidden inputs / virtual lists etc.
    isVirtual?: boolean

    // contains the value for non-scalar items, for objects/array it is undefined
    // use typing `WithScalarValue` for those, otherwise for `array`/`object` checkout the HOC: `extractValue` and typing `WithValue`
}
