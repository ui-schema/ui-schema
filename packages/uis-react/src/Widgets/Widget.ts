import * as React from 'react'
import { WithOnChange, WithScalarValue } from '@ui-schema/react/UIStore'
import { UIMetaContext } from '@ui-schema/react/UIMeta'
import { GroupRendererProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { WidgetPayload } from '@ui-schema/system/Widget'

// todo: maybe base partly on `AppliedWidgetEngineProps`?
export type WidgetOverrideType<C = {}, P extends {} = {}, W = WidgetsBindingFactory, A = UIStoreActions> =
    React.ComponentType<P & WidgetProps<W> & C> |
    React.ComponentType<P & WidgetProps<W> & C & WithOnChange<A>> |
    React.ComponentType<P & WidgetProps<W> & C & WithScalarValue<A>>

export type WidgetType<C = {}, W = WidgetsBindingFactory, A = UIStoreActions> = WidgetOverrideType<C, {}, W, A>

/**
 * Base widget props which are expected to exist no matter which data "type" the widget is for
 * - for only-scalar widgets add `WithScalarValue`
 * - for any-value-type widgets add `WithValue` and use the HOC `extractValue`
 * - `C` = custom `UIMetaContext` definition
 */
export interface WidgetProps<W = WidgetsBindingFactory> extends UIMetaContext<W>, WidgetPayload {
    // used by grid system
    // todo: move to "ReactWidgetStack of DS" / remove from standard / move from "WidgetProps" to the successor of "WidgetEngine", somehow coupled to the successor of "WidgetRenderer"
    noGrid?: GroupRendererProps['noGrid']

    // specifying hidden inputs / virtual lists etc.
    isVirtual?: boolean

    // contains the value for non-scalar items, for objects/array it is undefined
    // use typing `WithScalarValue` for those, otherwise for `array`/`object` checkout the HOC: `extractValue` and typing `WithValue`
}
