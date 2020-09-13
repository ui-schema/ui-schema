import * as React from 'react'
import { ColorBaseProps, ColorStaticBaseProps } from '@ui-schema/material-color/Base'

export function ColorSlider<P extends ColorBaseProps>(props: P): React.ReactElement<P>
export function ColorSliderStatic<P extends ColorStaticBaseProps>(props: P): React.ReactElement<P>
