import * as React from 'react'
import { ColorBaseInterface, ColorDialogDialogInterface, CustomDialog, ColorStaticBaseInterface } from '@ui-schema/material-color/Base'
import { ColorPicker } from '@ui-schema/ui-schema/CommonTypings'

export function ColorSketch<P extends ColorBaseInterface>(props: P): React.Component<P>
export function ColorSketchDialog(props: ColorBaseInterface & ColorPicker & CustomDialog & ColorDialogDialogInterface): React.Component
export function ColorSketchStatic<P extends ColorStaticBaseInterface>(props: P): React.Component<P>
