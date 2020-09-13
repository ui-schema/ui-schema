import * as React from 'react'
import { ColorBaseProps, ColorDialogBaseProps, ColorStaticBaseProps } from '@ui-schema/material-color/Base'

export function Color<P extends ColorBaseProps>(props: P): React.ReactElement<P>
export function ColorDialog<P extends ColorDialogBaseProps>(props: P): React.ReactElement<P>
export function ColorStatic<P extends ColorStaticBaseProps>(props: P): React.ReactElement<P>
