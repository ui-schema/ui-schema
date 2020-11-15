import * as React from 'react'
import { PluginProps } from '../../PluginStack/Plugin'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export type loadSchema = (ref: string) => void

export type getSchema = (ref: string) => StoreSchemaType<any> | null

export function useNetworkRef(): {
    getSchema: getSchema
    loadSchema: loadSchema
}

export function ReferencingNetworkHandler<P extends PluginProps>(props: P): React.ReactElement<P>
