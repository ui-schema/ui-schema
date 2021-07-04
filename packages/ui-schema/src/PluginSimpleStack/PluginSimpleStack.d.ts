import React from 'react'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { PluginSimple } from '@ui-schema/ui-schema/PluginSimpleStack/PluginSimple'

export function handlePluginSimpleStack<P extends PluginProps>(props: P, simpleStack: PluginSimple[]): P

export function PluginSimpleStack<P extends PluginProps>(props: P): React.ReactElement<P>
