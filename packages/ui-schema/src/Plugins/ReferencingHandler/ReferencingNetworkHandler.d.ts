import * as React from 'react'
import { PluginProps } from '../../PluginStack/Plugin'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

/**
 * @deprecated use `loadSchemaRefPlugin`, will be removed at v0.3.0
 */
export type loadSchema = loadSchemaRefPlugin

export type loadSchemaRefPlugin = (ref: string, rootId?: string, versions?: string[]) => void

/**
 * @deprecated use `loadSchemaRefPlugin`, will be removed at v0.3.0
 */
export type getSchema = getSchemaRefPlugin

export type getSchemaRefPlugin = (ref: string, rootId?: string, version?: string) => StoreSchemaType<any> | null

export function useNetworkRef(): {
    getSchema: getSchemaRefPlugin
    loadSchema: loadSchemaRefPlugin
}

export function ReferencingNetworkHandler<P extends PluginProps>(props: P): React.ReactElement<P>
