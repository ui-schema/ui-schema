import React from 'react'
import { extractValue } from '@ui-schema/ui-schema/UIStore/UIStoreProvider'
import { NextPluginRendererMemo, PluginProps } from '@ui-schema/ui-schema/PluginStack'

export const ExtractStorePlugin: React.ComponentType<PluginProps> = extractValue(NextPluginRendererMemo)
