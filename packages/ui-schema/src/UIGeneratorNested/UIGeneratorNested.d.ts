import * as React from 'react'
import { UIMetaContext, StoreKeys } from '@ui-schema/ui-schema/UIStore'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface UIGeneratorNestedProps {
    // the whole schema for this level
    schema: StoreSchemaType
    parentSchema: StoreSchemaType
    storeKeys: StoreKeys
    level?: number
    widgets?: UIMetaContext['widgets']
    t?: UIMetaContext['t']
    showValidity?: UIMetaContext['showValidity']
}

/**
 * @deprecated use PluginStack instead
 * @param props
 * @constructor
 */
export function UIGeneratorNested<P extends UIGeneratorNestedProps>(props: P): React.ReactElement
