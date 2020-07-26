import * as React from 'react'
import { ColorBaseInterface, ColorStaticBaseInterface } from '@ui-schema/material-color/Base'

export function ColorSlider<P extends ColorBaseInterface>(props: P): React.Component<P>
export function ColorSliderStatic<P extends ColorStaticBaseInterface>(props: P): React.Component<P>
