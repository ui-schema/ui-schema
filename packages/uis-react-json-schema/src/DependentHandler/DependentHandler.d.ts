import * as React from 'react'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'

export function DependentHandler<P extends WidgetPluginProps>(props: P): React.ReactElement<P>
