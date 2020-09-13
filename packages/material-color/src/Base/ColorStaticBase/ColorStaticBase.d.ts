import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { CSSProperties } from 'react'

export interface ColorStaticBaseProps extends WidgetProps{
    ColorPicker: React.ComponentType
    styles: CSSProperties
    pickerProps: object
}

export function ColorStaticBase<P extends ColorStaticBaseProps>(props: P): React.ReactElement<P>
