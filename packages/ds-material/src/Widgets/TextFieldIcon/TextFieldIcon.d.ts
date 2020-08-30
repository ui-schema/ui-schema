import React from 'react'
import { StringRendererProps, NumberRendererProps, TextRendererProps } from '../TextField'

export function StringIconRenderer<P extends StringRendererProps>(props: P): React.ReactElement<P>

export function TextIconRenderer<P extends TextRendererProps>(props: P): React.ReactElement<P>

export function NumberIconRenderer<P extends NumberRendererProps>(props: P): React.ReactElement<P>
