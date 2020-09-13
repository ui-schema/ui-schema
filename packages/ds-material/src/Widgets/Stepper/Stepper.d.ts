import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema'

export function Step<P extends WidgetProps>(props: P): React.ReactElement<P>

export function Stepper<P extends WidgetProps>(props: P): React.ReactElement<P>
