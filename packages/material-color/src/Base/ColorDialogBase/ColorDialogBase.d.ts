import * as React from 'react'
import { ColorBaseInterface } from '@ui-schema/material-color/Base/ColorBase'
import { ColorPicker } from '@ui-schema/ui-schema/CommonTypings'

export interface ColorDialogDialogInterface {
    hasFocus: boolean
    setFocus: Function
    children: React.ReactChildren
}

export type CustomDialog = React.Component

export function ColorDialogBase(props: ColorBaseInterface & ColorPicker & CustomDialog & ColorDialogDialogInterface): React.Component
