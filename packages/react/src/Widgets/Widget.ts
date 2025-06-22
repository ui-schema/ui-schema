import * as React from 'react'
import { WithOnChange, WithScalarValue } from '@ui-schema/react/UIStore'
import { GroupRendererProps } from '@ui-schema/react/Widgets'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { WidgetPayload } from '@ui-schema/ui-schema/Widget'

/**
 * dev note: here `P` must not use NoInfer, or it breaks the WidgetEngine `WidgetEngineOverrideProps`
 */
export type WidgetType<P = {}, A = UIStoreActions> =
    React.ComponentType<WidgetProps & P> |
    React.ComponentType<WidgetProps & P & WithOnChange<A>> |
    React.ComponentType<WidgetProps & P & WithScalarValue<A>>

/**
 * Base widget props which are expected to exist no matter which data "type" the widget is for
 * - for only-scalar widgets add `WithScalarValue`
 * - for any-value-type widgets add `WithValue` and use the HOC `extractValue`
 * - `C` = custom `UIMetaContext` definition
 */
export interface WidgetProps extends WidgetPayload, LegacyWidgets {
    // used by grid system
    // todo: move to "ReactWidgetStack of DS" / remove from standard / move from "WidgetProps" to the successor of "WidgetEngine", somehow coupled to the successor of "WidgetRenderer"
    noGrid?: GroupRendererProps['noGrid']

    // specifying hidden inputs / virtual lists etc.
    isVirtual?: boolean

    // contains the value for non-scalar items, for objects/array it is undefined
    // use typing `WithScalarValue` for those, otherwise for `array`/`object` checkout the HOC: `extractValue` and typing `WithValue`
}

// todo: remove this typing, just added until UIMeta pass through and typing is decided and migrated
export type LegacyWidgets = { widgets: any }
