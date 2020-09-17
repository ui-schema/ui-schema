import * as React from 'react'
import { PluginProps, PluginType } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { StoreKeys } from '@ui-schema/ui-schema/UIStore'

export interface PluginStackProps {
    level?: number
    schema: StoreSchemaType
    parentSchema: StoreSchemaType
    storeKeys: StoreKeys
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

