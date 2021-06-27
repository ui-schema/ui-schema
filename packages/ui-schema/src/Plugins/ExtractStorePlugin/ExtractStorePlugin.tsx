import React from 'react'
import { memo } from '@ui-schema/ui-schema/Utils/memo'
import { extractValue, WithValue } from '@ui-schema/ui-schema/UIStore'
import { NextPluginRenderer, PluginProps } from '@ui-schema/ui-schema/PluginStack'

const ExtractStorePluginBase: React.ComponentType<PluginProps & WithValue> = (p) => {
    return <NextPluginRenderer {...p}/>
}
export const ExtractStorePlugin: React.ComponentType<PluginProps> = extractValue(memo(ExtractStorePluginBase))
