import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface ThumbComponentProps {
    onClick: React.MouseEvent
    canDelete: boolean
    p: any
}

export function ThumbComponent<P extends React.PropsWithChildren<ThumbComponentProps>>(props: P): React.ReactElement<P>

export interface NumberSliderRendererProps extends WidgetProps {
    multipleOf: number
    min: number
    max: number
    enumVal: number
    constVal: number
    defaultVal: number
    minItems: number
    maxItems: number
}

export function NumberSliderRenderer<P extends NumberSliderRendererProps>(props: P): React.ReactElement<P>

export function NumberSlider<P extends NumberSliderRendererProps>(props: P): React.ReactElement<P>
