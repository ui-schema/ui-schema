import * as React from 'react'
import { PluginProps, PluginType } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { StoreKeys } from '@ui-schema/ui-schema/UIStore'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'

export interface PluginStackProps {
    level?: number
    schema: StoreSchemaType
    parentSchema: StoreSchemaType
    storeKeys: StoreKeys
    // overwrite widgets of MetaProvider for this particular PluginStack
    widgets?: WidgetsBindingBase

    // all other props are passed down to all rendering Plugins and the final widget
    [key: string]: any
}

export function PluginStack(
    props: PluginStackProps
): React.ReactElement<PluginProps>

export function PluginStackBase(
    props: PluginStackProps
): React.ReactElement<PluginProps>

export function getPlugin(current: number, pluginStack: []): PluginType | undefined

export function NextPluginRenderer<P extends PluginProps>(props: P): React.ReactElement<P>

export function NextPluginRendererMemo<P extends PluginProps>(props: P): React.ReactElement<P>

