import React from 'react'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'

export function handleValidatorStack<P extends PluginProps>(props: P): P

export function ValidatorStack<P extends PluginProps>(props: P): React.ReactElement<P>

