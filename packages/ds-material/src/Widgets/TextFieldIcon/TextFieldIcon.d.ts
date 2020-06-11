import React from 'react'
import { OrderedMap } from 'immutable'
import { StringRendererProps, NumberRendererProps, TextRendererProps } from '../TextField'

export type computeIcon = (schema: OrderedMap<{}, undefined>) => React.Component[]

export interface StringRendererPropsIcon extends StringRendererProps {
    InputProps: computeIcon
}

export interface TextRendererPropsIcon extends TextRendererProps {
    InputProps: computeIcon
}

export interface NumberRendererPropsIcon extends NumberRendererProps {
    InputProps: computeIcon
}

export function StringIconRenderer<P extends StringRendererPropsIcon>(props: P): React.Component<P>
export function TextIconRenderer<P extends TextRendererPropsIcon>(props: P): React.Component<P>
export function NumberIconRenderer<P extends NumberRendererPropsIcon>(props: P): React.Component<P>
