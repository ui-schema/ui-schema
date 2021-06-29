import React from 'react'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'

export function handlePluginSimpleStack<P extends PluginProps>(props: P): P

export function PluginSimpleStack<P extends PluginProps>(props: P): React.ReactElement<P>
