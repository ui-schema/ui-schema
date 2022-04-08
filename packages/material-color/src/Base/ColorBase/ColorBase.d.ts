import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface ColorBaseProps extends WidgetProps {
    value: string
    styles: React.CSSProperties
    refocus: boolean
    forceIcon: boolean
    pickerProps: object
    PickerContainer: React.ComponentType<React.PropsWithChildren<{
        setFocus: () => void
        hasFocus: boolean
    }>>
    ColorPicker: React.ComponentType<{
        color?: string
        disableAlpha?: boolean
        onChange?: (color: string) => void
        styles?: React.CSSProperties
        // todo: stricter typings would need to know which Picker is rendered
        [k: string]: any
    }>
}

export function ColorBase<P extends ColorBaseProps>(props: P): React.ReactElement<P>
