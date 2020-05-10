import * as React from 'react'
import { WidgetRendererPropsExtendedCheckValid } from '../../../../ui-schema/src/WidgetRendererProps'

export interface ThumbComponentProps {
    onClick: Function
    canDelete: boolean
    children: React.Component
    p: any
}

export function ThumbComponent<P extends ThumbComponentProps>(props: P): React.Component<P>

export interface NumberSliderRendererProps extends WidgetRendererPropsExtendedCheckValid {
    multipleOf: number
    min: number
    max: number
    enumVal: number
    constVal: number
    defaultVal: number
    minItems: number
    maxItems: number
}

export function NumberSliderRenderer<P extends NumberSliderRendererProps>(props: P): React.Component<P>

export function NumberSlider<P extends NumberSliderRendererProps>(props: P): React.Component<P>
