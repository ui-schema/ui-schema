import * as React from 'react'
import { OrderedMap } from 'immutable'
import { StoreKeys } from '../../../../ui-schema/src/EditorStore'
import { NextPluginRendererProps } from '../../../../ui-schema/src/EditorPluginStack'

export interface StepperProps {
    validity: boolean
    storeKeys: StoreKeys
    schema: OrderedMap<{}, undefined>
}

export interface StepInterface {
    storeKeys: StoreKeys
    schema: OrderedMap<{}, undefined>
    level: number
    p: any
}

export type nextPluginRendererHandler = (handler: NextPluginRendererProps) => NextPluginRendererProps

export interface NextPluginRendererProvider {
    children: nextPluginRendererHandler
}

export function Step<P extends NextPluginRendererProvider & StepInterface>(props: P): React.Component<P>

export function Stepper<P extends StepperProps>(props: P): React.Component<P>
