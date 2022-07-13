import * as React from 'react'
import { WidgetProps } from '@ui-schema/react/Widgets'

export interface OptionsRadioProps extends WidgetProps {
    row?: boolean
}

export function OptionsRadio<P extends OptionsRadioProps>(props: P): React.ReactElement
