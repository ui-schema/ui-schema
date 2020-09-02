import * as React from 'react'
import { StoreKeys } from '@ui-schema/ui-schema/EditorStore'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"

export interface StepperProps {
    validity: boolean
    storeKeys: StoreKeys
    schema: StoreSchemaType
}

export interface StepInterface {
    storeKeys: StoreKeys
    schema: StoreSchemaType
    level: number
    p: any
}

export type nextPluginRendererHandler = (handler: EditorPluginProps) => EditorPluginProps

export interface NextPluginRendererProvider {
    children: nextPluginRendererHandler
}

export function Step<P extends NextPluginRendererProvider & StepInterface>(props: P): React.ReactElement<P>

export function Stepper<P extends StepperProps>(props: P): React.ReactElement<P>
