import * as React from 'react'
import { StringRendererProps } from '@ui-schema/ds-material/Widgets'

export interface ColorBaseInterface extends StringRendererProps {
    value: string
    styles: object
    refocus: boolean | true
    forceIcon: boolean | false
    pickerProps: object
    PickerContainer: React.ComponentType
    ColorPicker: React.ComponentType
}

export function ColorBase<P extends ColorBaseInterface>(props: P): React.ReactElement<P>
