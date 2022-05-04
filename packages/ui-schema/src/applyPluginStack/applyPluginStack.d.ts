import React  from 'react'
import { PluginStackInjectProps, PluginStackWrapperProps } from '@ui-schema/ui-schema/PluginStack'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { UIMetaContext } from '@ui-schema/ui-schema/UIMeta'
import { StoreKeys, WithValue } from '@ui-schema/ui-schema/UIStore'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export type PluginStackRootOrNestedProps = {
    isRoot: true
} | {
    isRoot?: false
    // all indices of the current widget, must be set for nested plugins
    storeKeys: StoreKeys
    // `parentSchema` will only be `undefined` in the root level of a schema
    // todo: should this be typed differently between "props/passing-down" and "consuming/usages"?
    parentSchema: StoreSchemaType | undefined
}

// todo: add also generic widgets here?
export type AppliedPluginStackProps<CMeta extends {} = {}, PWidget extends WidgetProps = WidgetProps> =
    Omit<PWidget, PluginStackInjectProps | keyof (UIMetaContext & CMeta) | keyof WithValue | 'level'>
    & Partial<UIMetaContext & CMeta>
    & Partial<Pick<PWidget, 'showValidity' | 'level'>>
    & PluginStackRootOrNestedProps

export function applyPluginStack<CMeta extends {} = {}, PWidget extends WidgetProps = WidgetProps>(
    CustomWidget: React.ComponentType<PWidget>
): <PPlugin extends {} = {}>(props: AppliedPluginStackProps<CMeta, PWidget> & PPlugin) => React.ReactElement

export function injectPluginStack<CMeta extends {} = {}, PWidget extends WidgetProps = WidgetProps>(
    Wrapper: React.ComponentType<PluginStackWrapperProps>,
    CustomWidget?: React.ComponentType<PWidget>,
): <PPlugin extends {} = {}>(props: AppliedPluginStackProps<CMeta, PWidget> & PPlugin) => React.ReactElement
