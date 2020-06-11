import * as React from 'react'
import { StoreKeys } from '@ui-schema/ui-schema/EditorStore'
import { NextPluginRendererProps } from '@ui-schema/ui-schema/EditorPluginStack'
import { schema } from '@ui-schema/ui-schema/CommonTypings'

export interface StepperProps {
    validity: boolean
    storeKeys: StoreKeys
    schema: schema
}

export interface StepInterface {
    storeKeys: StoreKeys
    schema: schema
    level: number
    p: any
}

export type nextPluginRendererHandler = (handler: NextPluginRendererProps) => NextPluginRendererProps

export interface NextPluginRendererProvider {
    children: nextPluginRendererHandler
}

export function Step<P extends NextPluginRendererProvider & StepInterface>(props: P): React.Component<P>

export function Stepper<P extends StepperProps>(props: P): React.Component<P>
