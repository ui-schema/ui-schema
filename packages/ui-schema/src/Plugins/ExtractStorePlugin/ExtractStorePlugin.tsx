import React from 'react'
import { memo } from '@ui-schema/ui-schema/Utils/memo'
import { extractValue, WithValue } from '@ui-schema/ui-schema/UIStore'
import { getNextPlugin, PluginProps } from '@ui-schema/ui-schema/PluginStack'

const ExtractStorePluginBase: React.ComponentType<PluginProps & WithValue> = ({currentPluginIndex, ...p}) => {
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, p.widgets)
    return <Plugin {...p} currentPluginIndex={next}/>
}
export const ExtractStorePlugin: React.ComponentType<PluginProps> = extractValue(memo(ExtractStorePluginBase))
