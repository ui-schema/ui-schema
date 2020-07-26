import * as React from 'react'
import { StringRendererProps } from '@ui-schema/ds-material/Widgets'
import { ColorPicker, PickerContainer } from '@ui-schema/ui-schema/CommonTypings'

export interface ColorBaseInterface extends StringRendererProps {
    value: string
    styles: object
    refocus: boolean | true
    forceIcon: boolean | false
    pickerProps: object
    PickerContainer: PickerContainer
    ColorPicker: ColorPicker
}

export function ColorBase<P extends ColorBaseInterface>(props: P): React.Component<P>
