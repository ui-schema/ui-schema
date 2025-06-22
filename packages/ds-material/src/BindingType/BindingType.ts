import type { ComponentType } from 'react'
import type { WidgetProps, WidgetType } from '@ui-schema/react/Widgets'
import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import type { WithScalarValue } from '@ui-schema/react/UIStore'
import type { WidgetsBindingFactory } from '@ui-schema/react/Widgets'

export interface MuiWidgetsBindingTypes<C extends {} = {}> {
    string?: ComponentType<WidgetProps & C & WithScalarValue>
    boolean?: ComponentType<WidgetProps & C & WithScalarValue>
    number?: ComponentType<WidgetProps & C & WithScalarValue>
    integer?: ComponentType<WidgetProps & C & WithScalarValue>
    null?: ComponentType<WidgetProps & C & WithScalarValue>
    array?: ComponentType<WidgetProps & C>
    object?: ComponentType<WidgetProps & C>
}

export interface MuiWidgetsBindingCustom<C extends {} = {}, A = UIStoreActions> {
    [key: string]: WidgetType<C, A>
}

export type MuiWidgetsBinding<WE extends {} = {}, C extends {} = {}> = WidgetsBindingFactory<WE, MuiWidgetsBindingTypes<C>, MuiWidgetsBindingCustom<C>>
