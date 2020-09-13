import { ColorBaseProps, ColorStaticBaseProps } from '@ui-schema/material-color/Base'
import * as React from 'react'

export interface ColorCircleProps extends ColorBaseProps {
    circleSpacing: number
    circleSize: number
}

export interface ColorCircleStaticProps extends ColorStaticBaseProps {
    circleSpacing: number
    circleSize: number
}

export function ColorCircle<P extends ColorCircleProps>(props: P): React.ReactElement<P>

export function ColorCircleStatic<P extends ColorCircleStaticProps>(props: P): React.ReactElement<P>
