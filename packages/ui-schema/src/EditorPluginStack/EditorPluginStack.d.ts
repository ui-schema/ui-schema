import * as React from "react"
import { EditorPluginProps, EditorPluginType } from "@ui-schema/ui-schema/EditorPlugin"

export function getPlugin(current: number, pluginStack: []): EditorPluginType | undefined

export function NextPluginRenderer<P extends EditorPluginProps>(props: P): React.ComponentType<P>

export function NextPluginRendererMemo<P extends EditorPluginProps>(props: P): React.ComponentType<P>

export function FinalWidgetRenderer<P extends Pick<EditorPluginProps,
    "level" & "errors" & "onChange" & "ownKey" & "parentSchema" & "required" & "requiredList" & "schema" &
    "showValidity" & "storeKeys" & "value" & "valid" & "widgets">>(props: P): React.ComponentType<P>
