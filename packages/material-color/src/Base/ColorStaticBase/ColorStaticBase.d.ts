import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface ColorStaticBaseProps extends WidgetProps{
    ColorPicker: React.ComponentType
    styles: React.CSSProperties
    pickerProps: object
}

export function ColorStaticBase<P extends ColorStaticBaseProps>(props: P): React.ReactElement<P>
