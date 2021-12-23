import React from 'react'
import { PluginStackInjectProps } from '@ui-schema/ui-schema/PluginStack'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { UIMetaContext } from '@ui-schema/ui-schema/UIMeta'
import { WithValue } from '@ui-schema/ui-schema/UIStore'

// todo: add also generic widgets here?
export type AppliedPluginStackProps<WP extends WidgetProps<C> = WidgetProps<C>, C extends {} = {}> =
    Omit<WP, PluginStackInjectProps | keyof UIMetaContext<C> | keyof WithValue | 'level'>
    & Partial<UIMetaContext<C>>
    & Partial<Pick<WP, 'showValidity' | 'level'>>

export function applyPluginStack<C extends {} = {}, WP extends WidgetProps<C> = WidgetProps<C>>(CustomWidget: React.ComponentType<WP>):
    React.ComponentType<AppliedPluginStackProps<WP, C>>
