import React from 'react'
import { extractValue } from '@ui-schema/react/UIStore'
import { NextPluginRendererMemo, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'

export const ExtractStorePlugin = extractValue(NextPluginRendererMemo) as <P extends WidgetPluginProps>(props: P) => React.ReactElement
