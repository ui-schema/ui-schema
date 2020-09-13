import * as React from 'react'
import { ColorBaseProps, ColorDialogBaseProps, ColorStaticBaseProps } from '@ui-schema/material-color/Base'

export function ColorSketch<P extends ColorBaseProps>(props: P): React.ReactElement<P>
export function ColorSketchDialog<P extends ColorDialogBaseProps>(props: P): React.ReactElement<P>
export function ColorSketchStatic<P extends ColorStaticBaseProps>(props: P): React.ReactElement<P>
