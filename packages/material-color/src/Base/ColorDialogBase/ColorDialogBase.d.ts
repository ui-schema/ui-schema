import * as React from 'react'
import { ColorBaseProps } from '@ui-schema/material-color/Base/ColorBase'

export interface ColorDialogBaseProps extends ColorBaseProps {
    hasFocus: boolean
    setFocus: Function
}

export function ColorDialogBase<P extends React.PropsWithChildren<ColorDialogBaseProps>>(props: P): React.ReactElement<P>
