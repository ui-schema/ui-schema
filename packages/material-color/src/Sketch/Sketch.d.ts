import * as React from 'react'
import { ColorBaseInterface, ColorDialogDialogInterface, ColorStaticBaseInterface } from '@ui-schema/material-color/Base'

export function ColorSketch<P extends ColorBaseInterface>(props: P): React.ReactElement<P>
export function ColorSketchDialog(props: ColorBaseInterface & ColorDialogDialogInterface): React.ReactElement
export function ColorSketchStatic<P extends ColorStaticBaseInterface>(props: P): React.ReactElement<P>
