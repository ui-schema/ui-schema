import * as React from 'react'
import { ColorBaseInterface } from '@ui-schema/material-color/Base/ColorBase'

export interface ColorDialogDialogInterface {
    hasFocus: boolean
    setFocus: Function
    children: React.ReactChildren
}

export function ColorDialogBase(props: ColorBaseInterface & ColorDialogDialogInterface): React.ReactElement
