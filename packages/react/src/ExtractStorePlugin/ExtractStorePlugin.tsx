import { NextPluginMemo, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import type { ReactNode } from 'react'
import { extractValue } from '@ui-schema/react/UIStore'

export const ExtractStorePlugin = extractValue(NextPluginMemo) as <P extends WidgetPluginProps>(props: P) => ReactNode
