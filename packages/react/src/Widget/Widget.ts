import type { ComponentType } from 'react'
import type { UIMetaContext } from '@ui-schema/react/UIMeta'
import type { WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import type { WidgetPayload } from '@ui-schema/ui-schema/Widget'
import type { GroupRendererProps, BindingTypeGeneric } from './Binding.js'

/**
 * dev note: here `P` must not use NoInfer, or it breaks the WidgetEngine `WidgetEngineOverrideProps`
 */
export type WidgetType<P = {}, A = UIStoreActions> =
    ComponentType<WidgetPayload & P> |
    ComponentType<WidgetPayload & P & WithOnChange<A>> |
    ComponentType<WidgetPayload & P & WithValuePlain & WithOnChange<A>>

/**
 * Base widget props which are expected to exist no matter which data "type" the widget is for
 * - for only-scalar widgets add `WithScalarValue`
 * - for any-value-type widgets add `WithValue` and use the HOC `extractValue`
 * - `C` = custom `UIMetaContext` definition
 */
export interface WidgetProps<W = BindingTypeGeneric, A = UIStoreActions> extends WidgetPayload, UIMetaContext<W>, WithOnChange<A>, WithValuePlain {
    // used by grid system
    // todo: move to "ReactWidgetStack of DS" / remove from standard / move from "WidgetProps" to the successor of "WidgetEngine", somehow coupled to the successor of "WidgetRenderer"
    noGrid?: GroupRendererProps['noGrid']

    // specifying hidden inputs / virtual lists etc.
    isVirtual?: boolean
}
