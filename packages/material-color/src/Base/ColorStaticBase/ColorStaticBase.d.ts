import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { ColorBaseProps } from '@ui-schema/material-color/Base'

export interface ColorStaticBaseProps extends WidgetProps{
    ColorPicker: ColorBaseProps['ColorPicker']
    styles: React.CSSProperties
    pickerProps: object
}

export function ColorStaticBase<P extends ColorStaticBaseProps>(props: P): React.ReactElement<P>
