import * as React from 'react'
import { ColorBaseInterface, ColorStaticBaseInterface } from '@ui-schema/material-color/Base'

export function Color<P extends ColorBaseInterface>(props: P): React.Component<P>
export function ColorDialog<P extends ColorBaseInterface>(props: P): React.Component<P>
export function ColorStatic<P extends ColorStaticBaseInterface>(props: P): React.Component<P>
