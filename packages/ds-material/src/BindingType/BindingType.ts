import React from 'react'
import { WidgetProps, WidgetType } from '@ui-schema/react/Widgets'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { WithScalarValue } from '@ui-schema/react/UIStore'
import { WidgetsBindingFactory } from '@ui-schema/react/Widgets'

export interface MuiWidgetsBindingTypes<C extends {} = {}, W extends MuiWidgetsBinding = MuiWidgetsBinding> {
    string?: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    boolean?: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    number?: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    integer?: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    null?: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    array?: React.ComponentType<WidgetProps<W> & C>
    object?: React.ComponentType<WidgetProps<W> & C>
}

export interface MuiWidgetsBindingCustom<C extends {} = {}, W extends MuiWidgetsBinding = MuiWidgetsBinding, A = UIStoreActions> {
    [key: string]: WidgetType<C, W, A> | WidgetType<C, WidgetsBindingFactory, A>
}

export type MuiWidgetsBinding<WE extends {} = {}, C extends {} = {}> = WidgetsBindingFactory<WE, MuiWidgetsBindingTypes<C>, MuiWidgetsBindingCustom<C>>
