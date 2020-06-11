import * as React from "react"
import { OrderedMap } from 'immutable'
import { EditorStore } from "../EditorStore"
import { widgetsBase } from "../widgetsBase"

export type getPlugin = (current: number, pluginStack: []) => EditorStore<any>

export interface PluginStackRendererProps {
    schema: OrderedMap<{}, undefined>
    widgets: widgetsBase
}

export function PluginStackRenderer<P extends PluginStackRendererProps>(props: P): React.Component<P>// todo: should return EditorPlugin

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
