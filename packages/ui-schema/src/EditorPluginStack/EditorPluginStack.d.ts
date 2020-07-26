import * as React from "react"
import { OrderedMap } from 'immutable'
import { EditorStore } from "../EditorStore"
import { widgetsBase } from "../widgetsBase"

export function getPlugin(current: number, pluginStack: []): EditorStore<any>

export interface NextPluginRendererProps {
    current: number
    widgets: widgetsBase
}

export function NextPluginRenderer<P extends NextPluginRendererProps>(props: P): React.Component<P>

export function NextPluginRendererMemo<P extends NextPluginRendererProps>(props: P): React.Component<P>

export interface FinalWidgetRendererProps {
    value: any
    schema: OrderedMap<{}, undefined>
    widgets: widgetsBase
}

export function FinalWidgetRenderer<P extends FinalWidgetRendererProps>(props: P): React.Component<P>
