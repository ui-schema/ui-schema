import { ColorBaseInterface, ColorStaticBaseInterface } from '@ui-schema/material-color/Base'
import * as React from 'react'

export interface ColorCircleInterface {
    circleSpacing: number
    circleSize: number
}

export function ColorCircle(props: ColorCircleInterface & ColorBaseInterface): React.Component

export function ColorCircleStatic(props: ColorCircleInterface & ColorStaticBaseInterface): React.Component
