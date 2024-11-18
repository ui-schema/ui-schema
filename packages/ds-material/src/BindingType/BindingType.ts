import React from 'react'
import { WidgetProps, WidgetType } from '@ui-schema/ui-schema/Widget'
import { UIStoreActions } from '@ui-schema/ui-schema/UIStoreActions'
import { WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { WidgetsBindingFactory } from '@ui-schema/ui-schema/WidgetsBinding'
import { InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'

export interface MuiWidgetsBindingTypes<C extends {} = {}, W extends MuiWidgetBinding = MuiWidgetBinding> {
    string: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    boolean: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    number: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    integer: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
}

export interface MuiWidgetsBindingCustom<C extends {} = {}, W extends MuiWidgetBinding = MuiWidgetBinding, A = UIStoreActions> {
    [key: string]: WidgetType<C, W, A> | WidgetType<C, WidgetsBindingFactory, A>
}

export interface MuiWidgetBindingExtra {
    InfoRenderer?: React.ComponentType<InfoRendererProps>
}

export type MuiWidgetBinding<C extends {} = {}> = WidgetsBindingFactory<MuiWidgetBindingExtra, MuiWidgetsBindingTypes<C>, MuiWidgetsBindingCustom<C>>
