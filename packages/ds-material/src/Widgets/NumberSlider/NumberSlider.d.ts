import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { canDelete, children, multipleOf, min, max, enumVal, constVal, defaultVal, minItems, maxItems } from '@ui-schema/ui-schema/CommonTypings'

export interface ThumbComponentProps {
    onClick: React.MouseEvent
    canDelete: canDelete
    children: children
    p: any
}

export function ThumbComponent<P extends ThumbComponentProps>(props: P): React.Component<P>

export interface NumberSliderRendererProps extends WidgetProps {
    multipleOf: multipleOf
    min: min
    max: max
    enumVal: enumVal
    constVal: constVal
    defaultVal: defaultVal
    minItems: minItems
    maxItems: maxItems
}

export function NumberSliderRenderer<P extends NumberSliderRendererProps>(props: P): React.Component<P>

export function NumberSlider<P extends NumberSliderRendererProps>(props: P): React.Component<P>
