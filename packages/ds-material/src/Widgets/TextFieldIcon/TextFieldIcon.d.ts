import React from 'react'
import { StringRendererProps } from '@ui-schema/ds-material/Widgets'

export interface TextFieldIconProps extends StringRendererProps {
    InputProps?: undefined
}

export function StringIconRenderer<P extends TextFieldIconProps>(props: P): React.ReactElement<P>

export function TextIconRenderer<P extends TextFieldIconProps>(props: P): React.ReactElement<P>

export function NumberIconRenderer<P extends TextFieldIconProps>(props: P): React.ReactElement<P>
